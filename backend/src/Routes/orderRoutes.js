const express = require("express");
const router = express.Router();

const orderController = require("../Controllers/OrderController");
const { authenticate, requireAdmin } = require("../Middlewares/authMiddleware");

// Khách hàng đặt hàng
router.post("/", authenticate, (req, res) => {
    orderController.placeOrder(req, res);
});

// Khách hàng xem danh sách đơn của tôi
router.get("/my-orders", authenticate, (req, res) => {
    orderController.getMyOrders(req, res);
});

// Admin lấy danh sách toàn bộ đơn (lọc theo ?status=...)
router.get("/", authenticate, requireAdmin, (req, res) => {
    orderController.getAllOrdersForAdmin(req, res);
});

// Khách hàng xem chi tiết 1 đơn của mình
router.get("/:id", authenticate, (req, res) => {
    orderController.getOrderDetail(req, res);
});

// Khách hàng tự hủy đơn pending
router.put("/:id/cancel", authenticate, (req, res) => {
    orderController.cancelOrder(req, res);
});

// Admin chuyển trạng thái đơn (Chờ xác nhận -> Đang giao -> Hoàn thành / Đã hủy)
router.put("/:id/status", authenticate, requireAdmin, (req, res) => {
    orderController.updateOrderStatusByAdmin(req, res);
});

module.exports = router;