
const productService = require("../Services/ProductService");

class ProductController {
  // GET: Lấy danh sách sản phẩm
  async getAll(req, res) {
    try {
      const result = await productService.getAllProducts(
        req.query
      );

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách sản phẩm thành công.",
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      console.error("Get products error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Không thể lấy danh sách sản phẩm."
      });
    }
  }

  // GET: Lấy chi tiết sản phẩm
  async getById(req, res) {
    try {
      const product = await productService.getProductById(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết sản phẩm thành công.",
        data: product
      });
    } catch (error) {
      console.error("Get product error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Không thể lấy thông tin sản phẩm."
      });
    }
  }

  // POST: Thêm sản phẩm
  async create(req, res) {
    try {
      const product = await productService.createProduct(
        req.body,
        req.file
      );

      return res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công.",
        data: product
      });
    } catch (error) {
      console.error("Create product error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Không thể thêm sản phẩm."
      });
    }
  }

  // PUT: Cập nhật sản phẩm
  async update(req, res) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body,
        req.file
      );

      return res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công.",
        data: product
      });
    } catch (error) {
      console.error("Update product error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Không thể cập nhật sản phẩm."
      });
    }
  }

  // PATCH: Ẩn hoặc hiện sản phẩm
  async changeStatus(req, res) {
    try {
      const product = await productService.changeProductStatus(
        req.params.id,
        req.body.is_active
      );

      return res.status(200).json({
        success: true,
        message: product.is_active
          ? "Hiển thị sản phẩm thành công."
          : "Ẩn sản phẩm thành công.",
        data: product
      });
    } catch (error) {
      console.error("Change product status error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Không thể thay đổi trạng thái sản phẩm."
      });
    }
  }

  // DELETE: Xóa sản phẩm
  async delete(req, res) {
    try {
      await productService.deleteProduct(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Xóa sản phẩm thành công."
      });
    } catch (error) {
      console.error("Delete product error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode
          ? error.message
          : "Không thể xóa sản phẩm."
      });
    }
  }
}

module.exports = new ProductController();
