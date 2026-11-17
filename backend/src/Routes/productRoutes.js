
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

// GET danh sách sản phẩm: công khai
router.get("/", (req, res) =>
  productController.getAll(req, res)
);

// GET chi tiết sản phẩm: công khai
router.get("/:id", (req, res) =>
  productController.getById(req, res)
);

// Các API bên dưới yêu cầu đăng nhập và quyền Admin
router.use(authenticate, requireAdmin);

// Thêm sản phẩm
router.post("/", uploadProductImage, (req, res) =>
  productController.create(req, res)
);

// Cập nhật sản phẩm
router.put("/:id", uploadProductImage, (req, res) =>
  productController.update(req, res)
);

// Ẩn hoặc hiện sản phẩm
router.patch("/:id/status", (req, res) =>
  productController.changeStatus(req, res)
);

// Xóa sản phẩm
router.delete("/:id", (req, res) =>
  productController.delete(req, res)
);

module.exports = router;
