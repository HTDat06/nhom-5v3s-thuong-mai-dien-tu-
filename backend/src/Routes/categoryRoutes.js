
const express = require("express");
const router = express.Router();

const categoryController = require("../Controllers/CategoryController");
const {
    authenticate,
    requireAdmin
} = require("../Middlewares/authMiddleware");

// GET: Lấy danh sách danh mục (công khai)
router.get("/", (req, res) =>
    categoryController.getAll(req, res)
);

// Các API bên dưới chỉ dành cho Admin
router.post("/", authenticate, requireAdmin, (req, res) =>
    categoryController.create(req, res)
);

router.put("/:id", authenticate, requireAdmin, (req, res) =>
    categoryController.update(req, res)
);

router.delete("/:id", authenticate, requireAdmin, (req, res) =>
    categoryController.delete(req, res)
);

module.exports = router;
