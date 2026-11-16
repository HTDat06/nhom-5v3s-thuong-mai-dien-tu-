
const prisma = require("../config/prisma");

class CategoryRepository {
  // Lấy tất cả danh mục và số lượng sản phẩm
  async findAll() {
    return prisma.categories.findMany({
      orderBy: {
        category_id: "desc"
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  }

  // Tìm danh mục theo ID
  async findById(id) {
    return prisma.categories.findUnique({
      where: {
        category_id: id
      }
    });
  }

  // Lấy tên các danh mục để kiểm tra trùng
  async findAllNames() {
    return prisma.categories.findMany({
      select: {
        category_id: true,
        category_name: true
      }
    });
  }

  // Thêm danh mục
  async create(data) {
    return prisma.categories.create({
      data
    });
  }

  // Cập nhật danh mục
  async update(id, data) {
    return prisma.categories.update({
      where: {
        category_id: id
      },
      data
    });
  }

  // Đếm số sản phẩm thuộc danh mục
  async countProducts(categoryId) {
    return prisma.products.count({
      where: {
        category_id: categoryId
      }
    });
  }

  // Xóa danh mục
  async delete(id) {
    return prisma.categories.delete({
      where: {
        category_id: id
      }
    });
  }
}

module.exports = new CategoryRepository();
