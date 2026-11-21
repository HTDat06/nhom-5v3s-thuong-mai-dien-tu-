
jest.mock("../../Repositories/CategoryRepository", () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findAllNames: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  countProducts: jest.fn(),
  delete: jest.fn()
}));

const categoryRepository = require("../../Repositories/CategoryRepository");
const categoryService = require("../CategoryService");

beforeEach(() => {
  jest.resetAllMocks();
});

// ===============================
// TEST GET ALL CATEGORIES
// ===============================
describe("CategoryService - getAllCategories", () => {
  test("Lấy danh sách danh mục thành công", async () => {
    const categories = [
      { category_id: 1, category_name: "CPU" },
      { category_id: 2, category_name: "RAM" }
    ];

    categoryRepository.findAll.mockResolvedValue(categories);

    const result = await categoryService.getAllCategories();

    expect(result).toEqual(categories);
    expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
  });
});

// ===============================
// TEST CREATE CATEGORY
// ===============================
describe("CategoryService - createCategory", () => {
  test("Không cho phép tên danh mục để trống", async () => {
    await expect(
      categoryService.createCategory({ category_name: "" })
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(categoryRepository.create).not.toHaveBeenCalled();
  });

  test("Không cho phép tên danh mục chỉ chứa khoảng trắng", async () => {
    await expect(
      categoryService.createCategory({ category_name: "   " })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("Không cho phép tên danh mục vượt quá 225 ký tự", async () => {
    await expect(
      categoryService.createCategory({
        category_name: "A".repeat(226)
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("Không cho phép tên danh mục bị trùng", async () => {
    categoryRepository.findAllNames.mockResolvedValue([
      { category_id: 1, category_name: "CPU" }
    ]);

    await expect(
      categoryService.createCategory({
        category_name: " cpu "
      })
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(categoryRepository.create).not.toHaveBeenCalled();
  });

  test("Thêm danh mục thành công", async () => {
    categoryRepository.findAllNames.mockResolvedValue([]);

    const newCategory = {
      category_id: 3,
      category_name: "GPU",
      description: "Card màn hình"
    };

    categoryRepository.create.mockResolvedValue(newCategory);

    const result = await categoryService.createCategory({
      category_name: " GPU ",
      description: " Card màn hình "
    });

    expect(categoryRepository.create).toHaveBeenCalledWith({
      category_name: "GPU",
      description: "Card màn hình"
    });

    expect(result).toEqual(newCategory);
  });
});

// ===============================
// TEST UPDATE CATEGORY
// ===============================
describe("CategoryService - updateCategory", () => {
  test("Không cho phép ID danh mục không hợp lệ", async () => {
    await expect(
      categoryService.updateCategory("abc", {
        category_name: "GPU"
      })
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(categoryRepository.findById).not.toHaveBeenCalled();
  });

  test("Không cập nhật danh mục không tồn tại", async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(
      categoryService.updateCategory(99, {
        category_name: "GPU"
      })
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  test("Không cho phép tên danh mục để trống khi cập nhật", async () => {
    categoryRepository.findById.mockResolvedValue({
      category_id: 1,
      category_name: "CPU"
    });

    await expect(
      categoryService.updateCategory(1, {
        category_name: ""
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("Không cho phép tên danh mục bị trùng khi cập nhật", async () => {
    categoryRepository.findById.mockResolvedValue({
      category_id: 1,
      category_name: "CPU"
    });

    categoryRepository.findAllNames.mockResolvedValue([
      { category_id: 1, category_name: "CPU" },
      { category_id: 2, category_name: "GPU" }
    ]);

    await expect(
      categoryService.updateCategory(1, {
        category_name: "GPU"
      })
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  test("Không cho phép cập nhật khi không có dữ liệu", async () => {
    categoryRepository.findById.mockResolvedValue({
      category_id: 1,
      category_name: "CPU"
    });

    await expect(
      categoryService.updateCategory(1, {})
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test("Cập nhật danh mục thành công", async () => {
    categoryRepository.findById.mockResolvedValue({
      category_id: 1,
      category_name: "CPU"
    });

    categoryRepository.findAllNames.mockResolvedValue([
      { category_id: 1, category_name: "CPU" }
    ]);

    const updatedCategory = {
      category_id: 1,
      category_name: "CPU Intel"
    };

    categoryRepository.update.mockResolvedValue(updatedCategory);

    const result = await categoryService.updateCategory(1, {
      category_name: " CPU Intel "
    });

    expect(categoryRepository.update).toHaveBeenCalledWith(1, {
      category_name: "CPU Intel"
    });

    expect(result).toEqual(updatedCategory);
  });
});

// ===============================
// TEST DELETE CATEGORY
// ===============================
describe("CategoryService - deleteCategory", () => {
  test("Không cho phép ID danh mục không hợp lệ", async () => {
    await expect(
      categoryService.deleteCategory("abc")
    ).rejects.toMatchObject({ statusCode: 400 });

    expect(categoryRepository.findById).not.toHaveBeenCalled();
  });

  test("Không xóa danh mục không tồn tại", async () => {
    categoryRepository.findById.mockResolvedValue(null);

    await expect(
      categoryService.deleteCategory(99)
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(categoryRepository.delete).not.toHaveBeenCalled();
  });

  test("Không xóa danh mục đang có sản phẩm", async () => {
    categoryRepository.findById.mockResolvedValue({
      category_id: 1,
      category_name: "CPU"
    });

    categoryRepository.countProducts.mockResolvedValue(3);

    await expect(
      categoryService.deleteCategory(1)
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(categoryRepository.findById).toHaveBeenCalledWith(1);
    expect(categoryRepository.countProducts).toHaveBeenCalledWith(1);
    expect(categoryRepository.delete).not.toHaveBeenCalled();
  });

  test("Xóa danh mục thành công khi không có sản phẩm", async () => {
    categoryRepository.findById.mockResolvedValue({
      category_id: 2,
      category_name: "RAM"
    });

    categoryRepository.countProducts.mockResolvedValue(0);

    categoryRepository.delete.mockResolvedValue({
      category_id: 2,
      category_name: "RAM"
    });

    const result = await categoryService.deleteCategory(2);

    expect(categoryRepository.delete).toHaveBeenCalledWith(2);
    expect(result.category_id).toBe(2);
  });
});
