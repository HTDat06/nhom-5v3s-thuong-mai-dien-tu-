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

      // Kiểm tra định dạng DECIMAL(12,2)
      if (!/^\d{1,10}(\.\d{1,2})?$/.test(priceText)) {
        throw this.createError(
          "Giá sản phẩm phải là số lớn hơn 0 và tối đa 2 chữ số thập phân.",
          400
        );
      }

      const price = Number(priceText);

      // Giá bắt buộc phải lớn hơn 0
      if (!Number.isFinite(price) || price <= 0) {
        throw this.createError(
          "Giá sản phẩm phải lớn hơn 0.",
          400
        );
      }

      // Kiểm tra giới hạn DECIMAL(12,2)
      if (price > 9999999999.99) {
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

  // Tìm kiếm, lọc và phân trang sản phẩm
  async search(
    keyword,
    categoryId,
    minPrice,
    maxPrice,
    sort,
    page
  ) {
    // Kiểm tra trang
    page = page === undefined || page === ""
      ? 1
      : Number(page);

    if (!Number.isInteger(page) || page < 1) {
      throw this.createError(
        "Số trang không hợp lệ.",
        400
      );
    }

    // Từ khóa tìm kiếm
    keyword =
      typeof keyword === "string"
        ? keyword.trim()
        : "";

    // Lọc danh mục
    let parsedCategoryId;

    if (categoryId !== undefined && categoryId !== "") {
      parsedCategoryId = Number(categoryId);

      if (
        !Number.isInteger(parsedCategoryId) ||
        parsedCategoryId <= 0
      ) {
        throw this.createError(
          "ID danh mục không hợp lệ.",
          400
        );
      }
    }

    // Lọc giá thấp nhất
    let parsedMinPrice;

    if (minPrice !== undefined && minPrice !== "") {
      parsedMinPrice = Number(minPrice);

      if (
        !Number.isFinite(parsedMinPrice) ||
        parsedMinPrice < 0
      ) {
        throw this.createError(
          "Giá thấp nhất không hợp lệ.",
          400
        );
      }
    }

    // Lọc giá cao nhất
    let parsedMaxPrice;

    if (maxPrice !== undefined && maxPrice !== "") {
      parsedMaxPrice = Number(maxPrice);

      if (
        !Number.isFinite(parsedMaxPrice) ||
        parsedMaxPrice < 0
      ) {
        throw this.createError(
          "Giá cao nhất không hợp lệ.",
          400
        );
      }
    }

    // Kiểm tra khoảng giá
    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      throw this.createError(
        "Giá thấp nhất không được lớn hơn giá cao nhất.",
        400
      );
    }

    // Kiểm tra kiểu sắp xếp
    sort = sort || "newest";

    const allowedSort = [
      "newest",
      "price_asc",
      "price_desc"
    ];

    if (!allowedSort.includes(sort)) {
      throw this.createError(
        "Kiểu sắp xếp không hợp lệ.",
        400
      );
    }

    // Phân trang: 12 sản phẩm mỗi trang
    const limit = 12;
    const skip = (page - 1) * limit;

    const result = await productRepository.findAll({
      skip,
      take: limit,
      keyword,
      search: keyword,
      categoryId: parsedCategoryId,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      sort
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

  // Lấy danh sách sản phẩm
  async getAllProducts(query = {}) {
    return this.search(
      query.keyword ?? query.search,
      query.category_id,
      query.min_price,
      query.max_price,
      query.sort,
      query.page
    );
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
      if (!file) {
        throw this.createError(
          "Vui lòng tải ảnh đại diện sản phẩm.",
          400
        );
      }

      const productData = this.validateProductData(data);

      await this.validateCategory(productData.category_id);

      productData.image = file.imageUrl;

      return await productRepository.create(productData);
    } catch (error) {
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

      if (updateData.category_id !== undefined) {
        await this.validateCategory(updateData.category_id);
      }

      if (file) {
        updateData.image = file.imageUrl;
      }

      if (Object.keys(updateData).length === 0) {
        throw this.createError(
          "Vui lòng nhập thông tin cần cập nhật.",
          400
        );
      }

      const updatedProduct = await productRepository.update(
        productId,
        updateData
      );

      if (file && existingProduct.image) {
        const oldFilePath = this.getUploadedImagePath(
          existingProduct.image
        );

        removeUploadedImage(oldFilePath);
      }

      return updatedProduct;
    } catch (error) {
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

      const imagePath = this.getUploadedImagePath(
        product.image
      );

      removeUploadedImage(imagePath);

      return deletedProduct;
    } catch (error) {
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