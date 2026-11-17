const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");
const { authenticate } = require("../Middlewares/authMiddleware"); // Đảm bảo đúng tên hàm export trong middleware

router.get("/profile", authenticate, (req, res) => UserController.getProfile(req, res));
router.put("/profile", authenticate, (req, res) => UserController.updateProfile(req, res));
router.put('/change-password', authenticate, (req, res) => UserController.changePassword(req, res));

module.exports = router;