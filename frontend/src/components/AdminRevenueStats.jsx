import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function AdminRevenueStats() {
  const { token } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState({
    summary: {
      totalRevenue: 0,
      completedOrders: 0,
      averageOrderValue: 0,
      cancelledOrders: 0,
    },
    chartData: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async (customStart = startDate, customEnd = endDate) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (customStart) params.append("startDate", customStart);
      if (customEnd) params.append("endDate", customEnd);

      const queryString = params.toString();
      const url = `/api/admin/stats/revenue${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Không thể tải dữ liệu thống kê doanh thu.");
      }

      setStats(result.data);
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    fetchStats("", "");
  };

  const formatVND = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount || 0);

  const maxDailyRevenue = Math.max(...stats.chartData.map((d) => d.revenue), 1);

  return (
    <div style={{ padding: "20px 0" }}>
      <h2 style={{ marginBottom: "20px" }}>Thống Kê Doanh Thu</h2>

      {error && <p style={{ color: "#b91c1c", marginBottom: "16px" }}>{error}</p>}

      {/* Bộ lọc thời gian */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "24px", flexWrap: "wrap" }}>
        <div>
          <label style={{ marginRight: "6px" }}>Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: "6px" }}
          />
        </div>
        <div>
          <label style={{ marginRight: "6px" }}>Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: "6px" }}
          />
        </div>
        <button
          onClick={() => fetchStats()}
          disabled={loading}
          style={{
            padding: "7px 16px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Đang tải..." : "Lọc dữ liệu"}
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          style={{
            padding: "7px 12px",
            backgroundColor: "#e5e7eb",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Tất cả thời gian
        </button>
      </div>

      {/* 4 Thẻ chỉ số cốt lõi */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <div style={{ padding: "18px", borderRadius: "8px", backgroundColor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
          <div style={{ fontSize: "14px", color: "#065f46" }}>Doanh thu thực nhận</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#047857", marginTop: "6px" }}>
            {formatVND(stats.summary.totalRevenue)}
          </div>
        </div>

        <div style={{ padding: "18px", borderRadius: "8px", backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <div style={{ fontSize: "14px", color: "#1e40af" }}>Đơn hàng thành công</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#1d4ed8", marginTop: "6px" }}>
            {stats.summary.completedOrders} đơn
          </div>
        </div>

        <div style={{ padding: "18px", borderRadius: "8px", backgroundColor: "#fefce8", border: "1px solid #fef08a" }}>
          <div style={{ fontSize: "14px", color: "#854d0e" }}>Giá trị trung bình / đơn</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#a16207", marginTop: "6px" }}>
            {formatVND(stats.summary.averageOrderValue)}
          </div>
        </div>

        <div style={{ padding: "18px", borderRadius: "8px", backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
          <div style={{ fontSize: "14px", color: "#991b1b" }}>Đơn hàng bị hủy</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#b91c1c", marginTop: "6px" }}>
            {stats.summary.cancelledOrders} đơn
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo ngày */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>Biểu đồ doanh thu theo ngày</h3>
        {stats.chartData.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Chưa có đơn hàng hoàn thành trong khoảng thời gian này.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {stats.chartData.map((item) => {
              const percent = Math.round((item.revenue / maxDailyRevenue) * 100);
              return (
                <div key={item.date} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: "145px", fontSize: "13px", color: "#374151" }}>{item.date}</span>
                  <div style={{ flex: 1, backgroundColor: "#f3f4f6", borderRadius: "4px", height: "22px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${percent}%`,
                        backgroundColor: "#10b981",
                        height: "100%",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <span style={{ width: "130px", textAlign: "right", fontSize: "13px", fontWeight: "600" }}>
                    {formatVND(item.revenue)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bảng Top 5 sản phẩm bán chạy */}
      <div style={{ padding: "20px", border: "1px solid #e5e7eb", borderRadius: "8px", backgroundColor: "#fff" }}>
        <h3 style={{ marginBottom: "16px" }}>Top 5 sản phẩm bán chạy nhất</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ padding: "10px" }}>#</th>
              <th style={{ padding: "10px" }}>Tên sản phẩm</th>
              <th style={{ padding: "10px" }}>Số lượng đã bán</th>
              <th style={{ padding: "10px" }}>Doanh thu mang lại</th>
            </tr>
          </thead>
          <tbody>
            {stats.topProducts.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "12px", color: "#6b7280" }}>
                  Chưa có dữ liệu sản phẩm bán ra.
                </td>
              </tr>
            ) : (
              stats.topProducts.map((item, idx) => (
                <tr key={item.product_id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px" }}>{idx + 1}</td>
                  <td style={{ padding: "10px", fontWeight: "500" }}>{item.product_name}</td>
                  <td style={{ padding: "10px" }}>{item.totalSold}</td>
                  <td style={{ padding: "10px", color: "#047857", fontWeight: "600" }}>
                    {formatVND(item.revenue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRevenueStats;