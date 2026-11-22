
const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/UserController");

const {
    authenticate,
    requireAdmin
} = require("../Middlewares/authMiddleware");

// =====================================
// TM-14: QUẢN LÝ NGƯỜI DÙNG - ADMIN
// =====================================

// Xem danh sách, tìm kiếm, phân trang
router.get(
    "/admin",
    authenticate,
    requireAdmin,
    (req, res) => UserController.getAllUsers(req, res)
);

// Khóa tài khoản
router.put(
    "/admin/:id/lock",
    authenticate,
    requireAdmin,
    (req, res) => UserController.lockUser(req, res)
);

// Mở khóa tài khoản
router.put(
    "/admin/:id/unlock",
    authenticate,
    requireAdmin,
    (req, res) => UserController.unlockUser(req, res)
);

// =====================================
// TM-08: HỒ SƠ CÁ NHÂN
// =====================================

// Xem hồ sơ cá nhân
router.get(
    "/profile",
    authenticate,
    (req, res) => UserController.getProfile(req, res)
);

// Cập nhật hồ sơ cá nhân
router.put(
    "/profile",
    authenticate,
    (req, res) => UserController.updateProfile(req, res)
);

// Đổi mật khẩu
router.put(
    "/change-password",
    authenticate,
    (req, res) => UserController.changePassword(req, res)
);

module.exports = router;
