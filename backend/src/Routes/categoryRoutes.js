
const express = require("express");
const router = express.Router();

const categoryController = require("../Controllers/CategoryController");
const {
  authenticate,
  requireAdmin
} = require("../Middlewares/authMiddleware");

// GET: Lấy danh sách danh mục - Không cần đăng nhập
router.get("/", (req, res) =>
  categoryController.getAll(req, res)
);

// Các API bên dưới yêu cầu đăng nhập và quyền Admin
router.use(authenticate, requireAdmin);

// POST: Thêm danh mục
router.post("/", (req, res) =>
  categoryController.create(req, res)
);

// PUT: Cập nhật danh mục
router.put("/:id", (req, res) =>
  categoryController.update(req, res)
);

// DELETE: Xóa danh mục
router.delete("/:id", (req, res) =>
  categoryController.delete(req, res)
);

module.exports = router;
