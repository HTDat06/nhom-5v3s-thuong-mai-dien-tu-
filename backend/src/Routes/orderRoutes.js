const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const router = express.Router();

const orderController = require("../Controllers/OrderController");
const { authenticate, requireAdmin } = require("../Middlewares/authMiddleware");

// Cấu hình lưu file bằng chứng trả hàng vào backend/uploads/returns
const returnUploadDir = path.join(__dirname, "../../uploads/returns");
if (!fs.existsSync(returnUploadDir)) {
    fs.mkdirSync(returnUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, returnUploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `return-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    }
});

const uploadEvidence = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Tối đa 10MB
});

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

// Khách hàng xác nhận đã nhận hàng khi đơn đã hoàn thành
router.put("/:id/confirm-received", authenticate, (req, res) => {
    orderController.confirmReceivedOrder(req, res);
});

// Khách hàng gửi form yêu cầu trả hàng kèm lý do & ảnh/video bằng chứng
router.post("/:id/return-request", authenticate, uploadEvidence.single("evidence"), (req, res) => {
    orderController.submitReturnRequest(req, res);
});

// Admin chuyển trạng thái đơn (Chờ xác nhận -> Đang giao -> Hoàn thành / Đã hủy)
router.put("/:id/status", authenticate, requireAdmin, (req, res) => {
    orderController.updateOrderStatusByAdmin(req, res);
});

// Admin duyệt thu hồi hàng & hoàn tiền hoặc từ chối yêu cầu trả hàng
router.put("/:id/review-return", authenticate, requireAdmin, (req, res) => {
    orderController.reviewReturnRequestByAdmin(req, res);
});

module.exports = router;