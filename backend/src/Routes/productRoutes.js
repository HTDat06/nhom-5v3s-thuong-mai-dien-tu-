
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

// API công khai: khách chưa đăng nhập vẫn xem được
router.get("/", (req, res) =>
  productController.getAll(req, res)
);

router.get("/:id", (req, res) =>
  productController.getById(req, res)
);

// Các API quản lý sản phẩm: chỉ Admin được sử dụng
router.use(authenticate, requireAdmin);

// POST: Thêm sản phẩm
router.post(
  "/",
  uploadProductImage,
  (req, res) => productController.create(req, res)
);

// PUT: Cập nhật sản phẩm
router.put(
  "/:id",
  uploadProductImage,
  (req, res) => productController.update(req, res)
);

// PATCH: Ẩn hoặc hiện sản phẩm
router.patch("/:id/status", (req, res) =>
  productController.changeStatus(req, res)
);

// DELETE: Xóa sản phẩm
router.delete("/:id", (req, res) =>
  productController.delete(req, res)
);

module.exports = router;
