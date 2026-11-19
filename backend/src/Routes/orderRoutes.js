const express = require("express");
const router = express.Router();

const orderController = require("../Controllers/OrderController");
const { authenticate } = require("../Middlewares/authMiddleware");

router.post("/", authenticate, (req, res) => {
    orderController.placeOrder(req, res);
});

router.get("/my-orders", authenticate, (req, res) => {
    orderController.getMyOrders(req, res);
});

router.get("/:id", authenticate, (req, res) => {
    orderController.getOrderDetail(req, res);
});

router.put("/:id/cancel", authenticate, (req, res) => {
    orderController.cancelOrder(req, res);
});

module.exports = router;