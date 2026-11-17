
const prisma = require("../config/prisma");

class ProductRepository {
  // Lấy danh sách sản phẩm, tìm kiếm và phân trang
  async findAll({ skip, take, search, categoryId, isActive }) {
    const where = {};

    // Tìm kiếm theo tên sản phẩm hoặc mô tả
    if (search) {
      where.OR = [
        {
          product_name: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        }
      ];
    }

    // Lọc theo danh mục
    if (categoryId !== undefined) {
      where.category_id = categoryId;
    }

    // Lọc theo trạng thái ẩn/hiện
    if (isActive !== undefined) {
      where.is_active = isActive;
    }

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip,
        take,
        orderBy: {
          product_id: "desc"
        },
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
