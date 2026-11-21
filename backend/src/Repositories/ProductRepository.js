const prisma = require("../config/prisma");

class ProductRepository {
  // Lấy danh sách sản phẩm, tìm kiếm và phân trang
  async findAll({
    skip,
    take,
    search,
    keyword,
    categoryId,
    minPrice,
    maxPrice,
    isActive,
    sort
  }) {
    const where = {};

    // Tìm kiếm theo tên hoặc mô tả
    const searchKeyword = keyword || search;

    if (searchKeyword) {
      where.OR = [
        {
          product_name: {
            contains: searchKeyword
          }
        },
        {
          description: {
            contains: searchKeyword
          }
        }
      ];
    }

    // Lọc danh mục
    if (categoryId !== undefined) {
      where.category_id = categoryId;
    }

    // Lọc trạng thái
    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    // Lọc khoảng giá
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Sắp xếp
    let orderBy = {
      product_id: "desc"
    };

    if (sort === "price_asc") {
      orderBy = {
        price: "asc"
      };
    } else if (sort === "price_desc") {
      orderBy = {
        price: "desc"
      };
    }

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          categories: true
        }
      }),

      prisma.products.count({
        where
      })
    ]);

    return {
      products,
      total
    };
  }

  // Tìm sản phẩm theo ID
  async findById(id) {
    return prisma.products.findUnique({
      where: {
        product_id: id
      },
      include: {
        categories: true
      }
    });
  }

  // Kiểm tra danh mục
  async findCategoryById(categoryId) {
    return prisma.categories.findUnique({
      where: {
        category_id: categoryId
      }
    });
  }

  // Thêm sản phẩm
  async create(data) {
    return prisma.products.create({
      data,
      include: {
        categories: true
      }
    });
  }

  // Cập nhật sản phẩm
  async update(id, data) {
    return prisma.products.update({
      where: {
        product_id: id
      },
      data,
      include: {
        categories: true
      }
    });
  }

  // Đếm sản phẩm trong giỏ hàng
  async countCartItems(productId) {
    return prisma.cart_items.count({
      where: {
        product_id: productId
      }
    });
  }

  // Đếm sản phẩm trong chi tiết đơn hàng
  async countOrderItems(productId) {
    return prisma.order_items.count({
      where: {
        product_id: productId
      }
    });
  }

  // Xóa sản phẩm
  async delete(id) {
    return prisma.products.delete({
      where: {
        product_id: id
      }
    });
  }
}

module.exports = new ProductRepository();