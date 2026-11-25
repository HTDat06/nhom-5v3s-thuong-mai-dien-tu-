
const productRepository = require("../src/Repositories/ProductRepository");

// Mock uploadMiddleware để không tải file-type ESM
jest.mock("../src/Middlewares/uploadMiddleware", () => ({
  removeUploadedImage: jest.fn(),
}));

const productService = require("../src/Services/ProductService");

describe("ProductService - Kiểm thử tìm kiếm và lọc sản phẩm", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // TC01: Kiểm tra lọc sản phẩm theo khoảng giá
  it("Lọc sản phẩm theo khoảng giá", async () => {
    const mockProducts = [
      {
        product_id: 1,
        product_name: "RAM 16GB",
        price: 1000000,
      },
      {
        product_id: 2,
        product_name: "SSD 512GB",
        price: 1500000,
      },
      {
        product_id: 3,
        product_name: "CPU Ryzen 5",
        price: 4500000,
      },
    ];

    // Mock Repository, không truy vấn database thật
    const findAllSpy = jest
      .spyOn(productRepository, "findAll")
      .mockResolvedValue({
        products: mockProducts,
        total: 3,
      });

    // Gọi hàm search với khoảng giá
    const result = await productService.search(
      "",
      "",
      "1000000",
      "5000000",
      "newest",
      1
    );

    // Kiểm tra Repository nhận đúng khoảng giá
    expect(findAllSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        minPrice: 1000000,
        maxPrice: 5000000,
      })
    );

    // Kiểm tra kết quả trả về
    expect(result.products).toHaveLength(3);

    expect(
      result.products.map((product) => product.product_name)
    ).toEqual([
      "RAM 16GB",
      "SSD 512GB",
      "CPU Ryzen 5",
    ]);

    // Kiểm tra thông tin phân trang
    expect(result.pagination).toEqual({
      currentPage: 1,
      limit: 12,
      totalProducts: 3,
      totalPages: 1,
    });
  });

  // TC02: Kiểm tra khoảng giá không hợp lệ
  it("Báo lỗi khi giá thấp nhất lớn hơn giá cao nhất", async () => {
    const findAllSpy = jest.spyOn(
      productRepository,
      "findAll"
    );

    // Kiểm tra hàm search có phát sinh lỗi
    await expect(
      productService.search(
        "",
        "",
        5000000,
        1000000,
        "newest",
        1
      )
    ).rejects.toMatchObject({
      message: "Giá thấp nhất không được lớn hơn giá cao nhất.",
      statusCode: 400,
    });

    // Repository không được gọi khi khoảng giá sai
    expect(findAllSpy).not.toHaveBeenCalled();
  });
});
