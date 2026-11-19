
const orderService = require("../Services/OrderService");

class OrderController {
    async placeOrder(req, res) {
        try {
            // Lấy user_id từ JWT đã được authenticate xác thực
            const userId = req.user.user_id;

            const order = await orderService.placeOrder(
                userId,
                req.body || {}
            );

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
}

module.exports = new OrderController();
