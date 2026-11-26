const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../Middlewares/authMiddleware");
const statsController = require("../Controllers/StatsController");

router.get("/", authenticate, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Chào mừng quản trị viên đến với trang quản trị."
  });
});

// API thống kê doanh thu cho Admin
router.get("/stats/revenue", authenticate, requireAdmin, statsController.getRevenueStats);

module.exports = router;