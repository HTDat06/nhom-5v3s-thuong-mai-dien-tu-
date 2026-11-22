
const categoryService = require("../Services/CategoryService");

class CategoryController {
  // GET: Lấy danh sách danh mục
  async getAll(req, res) {
    try {
      const categories = await categoryService.getAllCategories();

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách danh mục thành công.",
        data: categories
      });
    } catch (error) {
      console.error("Get categories error:", error);

      return res.status(500).json({
        success: false,
        message: "Không thể lấy danh sách danh mục."
      });
    }
  }

  // POST: Thêm danh mục
  async create(req, res) {
    try {
      const category = await categoryService.createCategory(req.body || {});

      return res.status(201).json({
        success: true,
        message: "Thêm danh mục thành công.",
        data: category
      });
    } catch (error) {
      console.error("Create category error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Đã xảy ra lỗi máy chủ khi thêm danh mục."
      });
    }
  }

  // PUT: Cập nhật danh mục
  async update(req, res) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body || {}
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật danh mục thành công.",
        data: category
      });
    } catch (error) {
      console.error("Update category error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Đã xảy ra lỗi máy chủ khi cập nhật danh mục."
      });
    }
  }

  // DELETE: Xóa danh mục
  async delete(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Xóa danh mục thành công."
      });
    } catch (error) {
      console.error("Delete category error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Đã xảy ra lỗi máy chủ khi xóa danh mục."
      });
    }
  }
}

module.exports = new CategoryController();
