const orderService = require("../Services/OrderService");

class OrderController {
    async placeOrder(req, res) {
        try {
            const userId = req.user?.user_id ?? req.user?.userId ?? req.user?.id;
            const order = await orderService.placeOrder(userId, req.body || {});

            return res.status(201).json({
                success: true,
                message: "Đặt hàng thành công!",
                data: order
            });
        } catch (error) {
            console.error("Place order error:", error);
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode
                    ? error.message
                    : "Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau."
            });
        }
    }

    async getMyOrders(req, res) {
        try {
            const userId = req.user?.user_id ?? req.user?.userId ?? req.user?.id;
            const orders = await orderService.getMyOrders(userId);

            return res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode
                    ? error.message
                    : "Không thể tải danh sách đơn hàng."
            });
        }
    }

    async getOrderDetail(req, res) {
        try {
            const userId = req.user?.user_id ?? req.user?.userId ?? req.user?.id;
            const order = await orderService.getOrderDetail(userId, req.params.id);

            return res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode
                    ? error.message
                    : "Không thể tải chi tiết đơn hàng."
            });
        }
    }

    async cancelOrder(req, res) {
        try {
            const userId = req.user?.user_id ?? req.user?.userId ?? req.user?.id;
            const updatedOrder = await orderService.cancelOrder(userId, req.params.id);

            return res.status(200).json({
                success: true,
                message: "Đã hủy đơn hàng và hoàn lại tồn kho.",
                data: updatedOrder
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode
                    ? error.message
                    : "Không thể hủy đơn hàng."
            });
        }
    }

    // TM-13: Admin xem tất cả đơn & lọc theo trạng thái
    async getAllOrdersForAdmin(req, res) {
        try {
            const { status } = req.query;
            const orders = await orderService.getAllOrdersForAdmin(status);

            return res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode
                    ? error.message
                    : "Không thể tải danh sách đơn hàng quản trị."
            });
        }
    }

    // TM-13: Admin cập nhật trạng thái đơn
    async updateOrderStatusByAdmin(req, res) {
        try {
            const { status } = req.body || {};
            const updatedOrder = await orderService.updateOrderStatusByAdmin(
                req.params.id,
                status
            );

            return res.status(200).json({
                success: true,
                message: "Cập nhật trạng thái đơn hàng thành công!",
                data: updatedOrder
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode
                    ? error.message
                    : "Không thể cập nhật trạng thái đơn hàng."
            });
        }
    }
}

module.exports = new OrderController();