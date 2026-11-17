const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserController");
const { authenticate } = require("../Middlewares/authMiddleware"); // Sửa lại đúng tên file/hàm middleware của nhóm bạn

router.get("/profile", authenticate, (req, res) => UserController.getProfile(req, res));
router.put("/profile", authenticate, (req, res) => UserController.updateProfile(req, res));

module.exports = router;