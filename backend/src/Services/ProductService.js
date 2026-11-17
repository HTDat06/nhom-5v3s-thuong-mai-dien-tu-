
const productRepository = require("../Repositories/ProductRepository");

const {
  removeUploadedImage
} = require("../Middlewares/uploadMiddleware");

const path = require("path");

class ProductService {
  // Tạo lỗi nghiệp vụ
  createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  // Kiểm tra ID
  validateId(id) {
    const value = Number(id);

    if (!Number.isInteger(value) || value <= 0) {
      throw this.createError(
        "ID sản phẩm không hợp lệ.",
        400
      );
    }

    return value;
  }

  // Chuyển trạng thái thành Boolean
  parseBoolean(value) {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;

    throw this.createError(
      "Trạng thái sản phẩm phải là true hoặc false.",
      400
    );
  }

  // Kiểm tra và chuẩn hóa dữ liệu sản phẩm
  validateProductData(data = {}, isUpdate = false) {
    const result = {};

    // Tên sản phẩm
    if (!isUpdate || data.product_name !== undefined) {
      if (
        typeof data.product_name !== "string" ||
        !data.product_name.trim()
      ) {
        throw this.createError(
          "Vui lòng nhập tên sản phẩm.",
          400
        );
      }

      const productName = data.product_name.trim();

      if (productName.length > 225) {
        throw this.createError(
          "Tên sản phẩm không được vượt quá 225 ký tự.",
          400
        );
      }

      result.product_name = productName;
    }

    // Giá sản phẩm
    if (!isUpdate || data.price !== undefined) {
      const priceText = String(data.price ?? "").trim();

      // DECIMAL(12,2): tối đa 10 chữ số nguyên và 2 chữ số thập phân
      if (!/^\d{1,10}(\.\d{1,2})?$/.test(priceText)) {
        throw this.createError(
          "Giá sản phẩm phải là số không âm và tối đa 2 chữ số thập phân.",
          400
        );
      }

      const price = Number(priceText);

      if (!Number.isFinite(price) || price > 9999999999.99) {
        throw this.createError(
          "Giá sản phẩm vượt quá giới hạn cho phép.",
          400
        );
      }

      result.price = price;
    }

    // Tồn kho
    if (!isUpdate || data.stock !== undefined) {
      const stockText = String(data.stock ?? "").trim();
      const stock = Number(stockText);

      if (
        stockText === "" ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        !Number.isSafeInteger(stock)
      ) {
        throw this.createError(
          "Tồn kho phải là số nguyên không âm.",
          400
        );
      }

      result.stock = stock;
    }

    // Danh mục
    if (!isUpdate || data.category_id !== undefined) {
      const categoryId = Number(data.category_id);

      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        throw this.createError(
          "Danh mục không hợp lệ.",
          400
        );
      }

      result.category_id = categoryId;
    }

    // Mô tả
    if (data.description !== undefined) {
      if (
        data.description !== null &&
        typeof data.description !== "string"
      ) {
        throw this.createError(
          "Mô tả sản phẩm không hợp lệ.",
          400
        );
      }

      result.description =
        data.description?.trim() || null;
    } else if (!isUpdate) {
      result.description = null;
    }

    // Trạng thái ẩn/hiện
    if (data.is_active !== undefined) {
      result.is_active = this.parseBoolean(data.is_active);
    } else if (!isUpdate) {
      result.is_active = true;
    }

    return result;
  }

  // Kiểm tra danh mục có tồn tại không
  async validateCategory(categoryId) {
    const category = await productRepository.findCategoryById(
      categoryId
    );

    if (!category) {
      throw this.createError(
        "Danh mục sản phẩm không tồn tại.",
        404
      );
    }
  }

  // Lấy đường dẫn ảnh trong thư mục upload
  getUploadedImagePath(imageUrl) {
    if (
      typeof imageUrl !== "string" ||
      !imageUrl.startsWith("/uploads/products/")
    ) {
      return null;
    }

    const fileName = path.basename(imageUrl);

    return path.join(
      __dirname,
      "../../uploads/products",
      fileName
    );
  }

  // Lấy danh sách, tìm kiếm và phân trang
  async getAllProducts(query = {}) {
    const page = query.page === undefined
      ? 1
      : Number(query.page);

    const limit = query.limit === undefined
      ? 10
      : Number(query.limit);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      throw this.createError(
        "Thông tin phân trang không hợp lệ.",
        400
      );
    }

    // Từ khóa tìm kiếm
    const search =
      typeof query.search === "string"
        ? query.search.trim()
        : "";

    // Lọc theo danh mục
    let categoryId;

    if (query.category_id !== undefined) {
      categoryId = Number(query.category_id);

      if (
        !Number.isInteger(categoryId) ||
        categoryId <= 0
      ) {
        throw this.createError(
          "ID danh mục không hợp lệ.",
          400
        );
      }
    }

    // Lọc theo trạng thái
    let isActive;

    if (query.is_active !== undefined) {
      isActive = this.parseBoolean(query.is_active);
    }

    const skip = (page - 1) * limit;

    const result = await productRepository.findAll({
      skip,
      take: limit,
      search,
      categoryId,
      isActive
    });

    return {
      products: result.products,
      pagination: {
        currentPage: page,
        limit,
        totalProducts: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    };
  }

  // Lấy chi tiết sản phẩm
  async getProductById(id) {
    const productId = this.validateId(id);

    const product = await productRepository.findById(
      productId
    );

    if (!product) {
      throw this.createError(
        "Không tìm thấy sản phẩm.",
        404
      );
    }

    return product;
  }

  // Thêm sản phẩm
  async createProduct(data, file) {
    try {
      // Bắt buộc có ảnh đại diện khi thêm sản phẩm
      if (!file) {
        throw this.createError(
          "Vui lòng tải ảnh đại diện sản phẩm.",
          400
        );
      }

      const productData = this.validateProductData(data);

      // Kiểm tra danh mục
      await this.validateCategory(productData.category_id);

      // Đường dẫn ảnh
      productData.image = file.imageUrl;

      return await productRepository.create(productData);
    } catch (error) {
      // Nếu thêm sản phẩm thất bại thì xóa file ảnh vừa tải
      removeUploadedImage(file?.path);
      throw error;
    }
  }

  // Cập nhật sản phẩm
  async updateProduct(id, data, file) {
    const productId = this.validateId(id);

    try {
      const existingProduct =
        await productRepository.findById(productId);

      if (!existingProduct) {
        throw this.createError(
          "Không tìm thấy sản phẩm.",
          404
        );
      }

      const updateData = this.validateProductData(
        data,
        true
      );

      // Kiểm tra danh mục nếu có thay đổi
      if (updateData.category_id !== undefined) {
        await this.validateCategory(updateData.category_id);
      }

      // Nếu tải ảnh mới thì cập nhật đường dẫn
      if (file) {
        updateData.image = file.imageUrl;
      }

      if (Object.keys(updateData).length === 0) {
        throw this.createError(
          "Vui lòng nhập thông tin cần cập nhật.",
          400
        );
      }

      // Cập nhật database trước
      const updatedProduct = await productRepository.update(
        productId,
        updateData
      );

      // Cập nhật thành công mới xóa ảnh cũ
      if (file && existingProduct.image) {
        const oldFilePath = this.getUploadedImagePath(
          existingProduct.image
        );

        removeUploadedImage(oldFilePath);
      }

      return updatedProduct;
    } catch (error) {
      // Nếu cập nhật thất bại thì xóa ảnh mới vừa tải
      removeUploadedImage(file?.path);
      throw error;
    }
  }

  // Ẩn hoặc hiện sản phẩm
  async changeProductStatus(id, isActive) {
    const productId = this.validateId(id);

    if (typeof isActive !== "boolean") {
      throw this.createError(
        "Trạng thái không hợp lệ.",
        400
      );
    }

    const product = await productRepository.findById(
      productId
    );

    if (!product) {
      throw this.createError(
        "Không tìm thấy sản phẩm.",
        404
      );
    }

    return productRepository.update(productId, {
      is_active: isActive
    });
  }

  // Xóa sản phẩm
  async deleteProduct(id) {
    const productId = this.validateId(id);

    const product = await productRepository.findById(
      productId
    );

    if (!product) {
      throw this.createError(
        "Không tìm thấy sản phẩm.",
        404
      );
    }

    // Kiểm tra sản phẩm đang được sử dụng
    const [cartCount, orderCount] = await Promise.all([
      productRepository.countCartItems(productId),
      productRepository.countOrderItems(productId)
    ]);

    if (cartCount > 0 || orderCount > 0) {
      throw this.createError(
        "Không thể xóa sản phẩm vì sản phẩm đang có trong giỏ hàng hoặc đơn hàng. Bạn có thể ẩn sản phẩm thay thế.",
        409
      );
    }

    try {
      const deletedProduct = await productRepository.delete(
        productId
      );

      // Xóa ảnh sau khi xóa sản phẩm thành công
      const imagePath = this.getUploadedImagePath(
        product.image
      );

      removeUploadedImage(imagePath);

      return deletedProduct;
    } catch (error) {
      // Xử lý trường hợp có dữ liệu liên quan phát sinh
      if (error.code === "P2003") {
        throw this.createError(
          "Không thể xóa sản phẩm vì đang được sử dụng.",
          409
        );
      }

      throw error;
    }
  }
}

module.exports = new ProductService();
