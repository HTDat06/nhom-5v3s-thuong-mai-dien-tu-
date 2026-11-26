const prisma = require("../config/prisma");

const COMPLETED_STATUS = "completed";
const CANCELLED_STATUS = "cancelled";

class StatsController {
  async getRevenueStats(req, res) {
    try {
      const { startDate, endDate } = req.query;

      // Lọc theo confirmed_at nếu Admin có chọn khoảng ngày
      const dateFilter = {};
      if (startDate || endDate) {
        dateFilter.confirmed_at = {};
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          dateFilter.confirmed_at.gte = start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          dateFilter.confirmed_at.lte = end;
        }
      }

      const allOrders = await prisma.orders.findMany({
        where: dateFilter,
        select: {
          order_id: true,
          total_amount: true,
          status: true,
          confirmed_at: true,
        },
      });

      let totalRevenue = 0;     // 1. Doanh thu thực nhận (chỉ tính đơn completed)
      let completedOrders = 0;  // 2. Số đơn hàng thành công
      let cancelledOrders = 0;  // 3. Số đơn hàng bị hủy
      const dailyMap = {};

      allOrders.forEach((order) => {
        if (order.status === COMPLETED_STATUS) {
          const amount = Number(order.total_amount || 0);
          totalRevenue += amount;
          completedOrders += 1;

          const dateKey = order.confirmed_at
            ? new Date(order.confirmed_at).toISOString().split("T")[0]
            : "Chưa xác nhận ngày";
          dailyMap[dateKey] = (dailyMap[dateKey] || 0) + amount;
        } else if (order.status === CANCELLED_STATUS) {
          cancelledOrders += 1;
        }
      });

      // 4. Giá trị trung bình mỗi đơn
      const averageOrderValue =
        completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

      // Dữ liệu biểu đồ theo ngày
      const chartData = Object.keys(dailyMap)
        .sort()
        .map((date) => ({
          date,
          revenue: dailyMap[date],
        }));

      // Top 5 sản phẩm bán chạy (chỉ tính đơn completed, không tính đơn returned/cancelled)
      const topProductsRaw = await prisma.order_items.groupBy({
        by: ["product_id"],
        where: {
          orders: {
            status: COMPLETED_STATUS,
            ...dateFilter,
          },
        },
        _sum: {
          quantity: true,
          subtotal: true,
        },
        orderBy: {
          _sum: { quantity: "desc" },
        },
        take: 5,
      });

      const productIds = topProductsRaw.map((item) => item.product_id);
      const products = await prisma.products.findMany({
        where: { product_id: { in: productIds } },
        select: { product_id: true, product_name: true },
      });

      const topProducts = topProductsRaw.map((item) => {
        const prod = products.find((p) => p.product_id === item.product_id);
        return {
          product_id: item.product_id,
          product_name: prod ? prod.product_name : "Sản phẩm đã xóa",
          totalSold: item._sum.quantity || 0,
          revenue: Number(item._sum.subtotal || 0),
        };
      });

      return res.status(200).json({
        success: true,
        data: {
          summary: {
            totalRevenue,
            completedOrders,
            averageOrderValue,
            cancelledOrders,
          },
          chartData,
          topProducts,
        },
      });
    } catch (error) {
      console.error("Lỗi lấy thống kê doanh thu:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi thống kê doanh thu.",
      });
    }
  }
}

module.exports = new StatsController();