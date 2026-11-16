
const categoryRepository = require("../Repositories/CategoryRepository");

class CategoryService {
  // Tạo lỗi nghiệp vụ có mã HTTP
  createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  // Kiểm tra ID hợp lệ
  validateId(id) {
    const categoryId = Number(id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw this.createError("ID danh mục không hợp lệ.", 400);
    }

    return categoryId;
  }

  // Kiểm tra tên danh mục bị trùng
  async checkDuplicateName(categoryName, excludeId = null) {
    const categories = await categoryRepository.findAllNames();

    const normalizedName = categoryName.trim().toLowerCase();

    const duplicate = categories.some((category) => {
      return (
        category.category_name.trim().toLowerCase() === normalizedName &&
        category.category_id !== excludeId
      );
    });

    if (duplicate) {
      throw this.createError("Tên danh mục đã tồn tại.", 409);
    }
  }

  // Lấy danh sách danh mục
  async getAllCategories() {
    return categoryRepository.findAll();
  }

  // Thêm danh mục
  async createCategory(data = {}) {
    const { category_name, description } = data;

    if (
      typeof category_name !== "string" ||
      !category_name.trim()
    ) {
      throw this.createError("Vui lòng nhập tên danh mục.", 400);
    }

    const normalizedName = category_name.trim();

    if (normalizedName.length > 225) {
      throw this.createError(
        "Tên danh mục không được vượt quá 225 ký tự.",
        400
      );
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      throw this.createError("Mô tả danh mục không hợp lệ.", 400);
    }

    await this.checkDuplicateName(normalizedName);

    return categoryRepository.create({
      category_name: normalizedName,
      description: description?.trim() || null
    });
  }

  // Cập nhật danh mục
  async updateCategory(id, data = {}) {
    const categoryId = this.validateId(id);

    const existingCategory = await categoryRepository.findById(categoryId);

    if (!existingCategory) {
      throw this.createError("Không tìm thấy danh mục.", 404);
    }

    const updateData = {};

    if (data.category_name !== undefined) {
      if (
        typeof data.category_name !== "string" ||
        !data.category_name.trim()
      ) {
        throw this.createError("Tên danh mục không được để trống.", 400);
      }

      const normalizedName = data.category_name.trim();

      if (normalizedName.length > 225) {
        throw this.createError(
          "Tên danh mục không được vượt quá 225 ký tự.",
          400
        );
      }

      await this.checkDuplicateName(normalizedName, categoryId);

      updateData.category_name = normalizedName;
    }

    if (data.description !== undefined) {
      if (
        data.description !== null &&
        typeof data.description !== "string"
      ) {
        throw this.createError("Mô tả danh mục không hợp lệ.", 400);
      }

      updateData.description = data.description?.trim() || null;
    }

    if (Object.keys(updateData).length === 0) {
      throw this.createError("Không có thông tin cần cập nhật.", 400);
    }

    return categoryRepository.update(categoryId, updateData);
  }

  // Xóa danh mục
  async deleteCategory(id) {
    const categoryId = this.validateId(id);

    const existingCategory = await categoryRepository.findById(categoryId);

    if (!existingCategory) {
      throw this.createError("Không tìm thấy danh mục.", 404);
    }

    const productCount = await categoryRepository.countProducts(categoryId);

    if (productCount > 0) {
      throw this.createError(
        `Không thể xóa danh mục vì đang có ${productCount} sản phẩm thuộc danh mục này.`,
        409
      );
    }

    return categoryRepository.delete(categoryId);
  }
}

module.exports = new CategoryService();
