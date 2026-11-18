
const express = require("express");
const router = express.Router();

const productController = require("../Controllers/ProductController");

const {
  authenticate,
  requireAdmin
} = require("../Middlewares/authMiddleware");

const {
  uploadProductImage
} = require("../Middlewares/uploadMiddleware");

// =====================================
// API CÔNG KHAI - KHÔNG CẦN ĐĂNG NHẬP
// =====================================

// GET: Danh sách, tìm kiếm và phân trang
router.get("/", (req, res) =>
  productController.getAll(req, res)
);

// GET: Chi tiết sản phẩm
router.get("/:id", (req, res) =>
  productController.getById(req, res)
);

// =====================================
// API QUẢN LÝ - CHỈ ADMIN ĐƯỢC PHÉP
// =====================================

// POST: Thêm sản phẩm và tải ảnh
router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadProductImage,
  (req, res) => productController.create(req, res)
);

// PUT: Cập nhật thông tin và có thể thay ảnh
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  uploadProductImage,
  (req, res) => productController.update(req, res)
);

// PATCH: Ẩn hoặc hiện sản phẩm
router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  (req, res) => productController.changeStatus(req, res)
);

// DELETE: Xóa sản phẩm
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  (req, res) => productController.delete(req, res)
);

module.exports = router;
