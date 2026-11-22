import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cancelOrderRequest, getOrderDetailRequest } from "../services/myOrderService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const STATUS_LABEL = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
};

const resolveImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/64?text=No+Image";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

function OrderDetailPage() {
    const { id } = useParams();
    const { token } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [errorState, setErrorState] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchDetail = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setErrorState(null);
            const data = await getOrderDetailRequest(token, id);
            setOrder(data);
        } catch (err) {
            setErrorState({
                status: err.status || 500,
                message: err.message || "Không thể tải chi tiết đơn hàng.",
            });
        } finally {
            setLoading(false);
        }
    }, [token, id]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    const handleCancelOrder = async () => {
        if (!window.confirm(`Xác nhận hủy đơn hàng #${order.order_id}?`)) {
            return;
        }
        try {
            setCancelling(true);
            setSuccessMessage("");
            const res = await cancelOrderRequest(token, order.order_id);
            setOrder(res.data);
            setSuccessMessage(res.message || "Đã hủy đơn hàng thành công.");
        } catch (err) {
            alert(err.message || "Không thể hủy đơn hàng.");
        } finally {
            setCancelling(false);
        }
    };

    const formatCurrency = (val) => Number(val || 0).toLocaleString("vi-VN") + " ₫";

    if (!token) {
        return (
            <div style={styles.container}>
                <div style={styles.box}>
                    <p>Vui lòng đăng nhập để xem chi tiết đơn hàng.</p>
                    <Link to="/login" style={styles.primaryBtn}>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.box}>Đang tải thông tin đơn hàng #{id}...</div>
            </div>
        );
    }

    if (errorState) {
        return (
            <div style={styles.container}>
                <div style={styles.errorBox}>
                    <h2 style={{ color: "#c62828", marginBottom: "8px" }}>
                        Lỗi {errorState.status}: Không thể truy cập đơn hàng
                    </h2>
                    <p style={{ marginBottom: "18px", color: "#444" }}>{errorState.message}</p>
                    <Link to="/my-orders" style={styles.primaryBtn}>
                        ← Quay lại danh sách đơn hàng của tôi
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const isPending = order.status === "pending";

    return (
        <div style={styles.container}>
            <div style={styles.topBar}>
                <Link to="/my-orders" style={styles.backLink}>
                    ← Quay lại Đơn hàng của tôi
                </Link>
            </div>

            {successMessage && <div style={styles.successBanner}>{successMessage}</div>}

            <div style={styles.box}>
                <div style={styles.headerRow}>
                    <h2 style={{ margin: 0 }}>Chi tiết đơn hàng #{order.order_id}</h2>
                    <span style={styles.statusBadge}>
                        Trạng thái: <strong>{STATUS_LABEL[order.status] || order.status}</strong>
                    </span>
                </div>

                <div style={styles.infoGrid}>
                    <div>
                        <strong>Người nhận:</strong> {order.receiver_name}
                    </div>
                    <div>
                        <strong>Số điện thoại:</strong> {order.phone}
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <strong>Địa chỉ nhận hàng:</strong> {order.shipping_address}
                    </div>
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>Sản phẩm</th>
                            <th style={styles.th}>Đơn giá</th>
                            <th style={styles.th}>Số lượng</th>
                            <th style={styles.th}>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(order.order_items || []).map((item) => (
                            <tr key={item.order_item_id} style={styles.tr}>
                                <td style={styles.tdProduct}>
                                    <img
                                        src={resolveImageUrl(item.products?.image)}
                                        alt={item.products?.product_name}
                                        style={styles.img}
                                    />
                                    <span>{item.products?.product_name || "Sản phẩm"}</span>
                                </td>
                                <td style={styles.td}>{formatCurrency(item.price)}</td>
                                <td style={styles.td}>{item.quantity}</td>
                                <td style={{ ...styles.td, fontWeight: "600" }}>
                                    {formatCurrency(item.subtotal)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={styles.footerRow}>
                    <div style={{ fontSize: "18px" }}>
                        Tổng thanh toán:{" "}
                        <strong style={{ color: "#d32f2f", fontSize: "22px" }}>
                            {formatCurrency(order.total_amount)}
                        </strong>
                    </div>

                    {isPending && (
                        <button
                            type="button"
                            disabled={cancelling}
                            onClick={handleCancelOrder}
                            style={styles.cancelBtn}
                        >
                            {cancelling ? "Đang xử lý hủy..." : "Hủy đơn hàng"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: "950px", margin: "24px auto", padding: "0 16px" },
    topBar: { marginBottom: "14px" },
    backLink: { color: "#1976d2", textDecoration: "none", fontWeight: "500" },
    successBanner: {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
        border: "1px solid #a5d6a7",
        padding: "10px 14px",
        borderRadius: "6px",
        marginBottom: "14px",
    },
    box: {
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "20px",
    },
    errorBox: {
        backgroundColor: "#fff",
        border: "1px solid #ef9a9a",
        borderRadius: "8px",
        padding: "36px 20px",
        textAlign: "center",
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        paddingBottom: "14px",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "10px",
    },
    statusBadge: {
        backgroundColor: "#f5f5f5",
        padding: "6px 12px",
        borderRadius: "6px",
        fontSize: "14px",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        backgroundColor: "#fafafa",
        padding: "14px",
        borderRadius: "6px",
        marginBottom: "18px",
        fontSize: "14px",
    },
    table: { width: "100%", borderCollapse: "collapse", marginBottom: "18px" },
    theadRow: { backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" },
    th: { padding: "10px 12px", textAlign: "left" },
    tr: { borderBottom: "1px solid #eee" },
    td: { padding: "12px", verticalAlign: "middle" },
    tdProduct: { padding: "12px", display: "flex", alignItems: "center", gap: "10px" },
    img: { width: "52px", height: "52px", objectFit: "cover", borderRadius: "4px" },
    footerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #eee",
        paddingTop: "16px",
        flexWrap: "wrap",
        gap: "12px",
    },
    primaryBtn: {
        display: "inline-block",
        backgroundColor: "#1976d2",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: "600",
    },
    cancelBtn: {
        backgroundColor: "#d32f2f",
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
    },
};

export default OrderDetailPage;