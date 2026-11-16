const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../Middlewares/authMiddleware");
const UserController = require("../Controllers/UserController");

// Tất cả API bên dưới chỉ dành cho Admin
router.use(authenticate, requireAdmin);
router.get("/", authenticate, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Chào mừng quản trị viên đến với trang quản trị."
  });
});
router.get("/users", (req, res) => UserController.list(req, res));
module.exports = router;
