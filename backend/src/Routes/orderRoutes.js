
const express = require("express");
const router = express.Router();

const orderController = require("../Controllers/OrderController");
const { authenticate } = require("../Middlewares/authMiddleware");

// Khách hàng phải đăng nhập mới được đặt hàng
router.post("/", authenticate, (req, res) => {
    orderController.placeOrder(req, res);
});

module.exports = router;
