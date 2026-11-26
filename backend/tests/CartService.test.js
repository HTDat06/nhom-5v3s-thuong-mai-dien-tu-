
// Mock PrismaClient trước khi import CartService và CartRepository
const mockPrisma = {
  products: {
    findUnique: jest.fn(),
  },
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

const CartRepository = require("../src/Repositories/CartRepository");
const CartService = require("../src/Services/CartService");

describe("CartService - Kiểm thử tồn kho khi thêm/cập nhật giỏ hàng", () => {
  let createCalled;
  let updateCalled;

  beforeEach(() => {
    jest.clearAllMocks();

    createCalled = false;
    updateCalled = false;

    // Mặc định sản phẩm còn 5 sản phẩm
    mockPrisma.products.findUnique.mockResolvedValue({
      product_id: 1,
      product_name: "Áo thun test",
      stock: 5,
    });

    // Mock Repository
    CartRepository.findByUserAndProduct = jest.fn().mockResolvedValue(null);

    CartRepository.create = jest.fn(async (userId, productId, qty) => {
      createCalled = true;

      return {
        cart_item_id: 10,
        user_id: userId,
        product_id: productId,
        quantity: qty,
      };
    });

    CartRepository.updateQuantity = jest.fn(async (cartItemId, qty) => {
      updateCalled = true;

      return {
        cart_item_id: cartItemId,
        quantity: qty,
      };
    });

    CartRepository.findById = jest.fn();
  });

  it("Từ chối thêm mới vào giỏ khi số lượng vượt quá tồn kho", async () => {
    await expect(
      CartService.add(1, 1, 6)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Số lượng vượt quá tồn kho (chỉ còn 5 sản phẩm).",
    });

    expect(createCalled).toBe(false);
    expect(updateCalled).toBe(false);
  });

  it("Từ chối khi tổng số lượng trong giỏ + số lượng thêm mới vượt tồn kho", async () => {
    CartRepository.findByUserAndProduct.mockResolvedValue({
      cart_item_id: 99,
      user_id: 1,
      product_id: 1,
      quantity: 3,
    });

    await expect(
      CartService.add(1, 1, 3)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Số lượng vượt quá tồn kho (chỉ còn 5 sản phẩm).",
    });

    expect(updateCalled).toBe(false);
  });

  it("Từ chối thêm vào giỏ khi sản phẩm đã hết hàng", async () => {
    mockPrisma.products.findUnique.mockResolvedValue({
      product_id: 1,
      product_name: "Áo thun hết hàng",
      stock: 0,
    });

    await expect(
      CartService.add(1, 1, 1)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Sản phẩm hiện đã hết hàng.",
    });

    expect(createCalled).toBe(false);
    expect(updateCalled).toBe(false);
  });

  it("Từ chối cập nhật số lượng trong giỏ vượt quá tồn kho", async () => {
    CartRepository.findById.mockResolvedValue({
      cart_item_id: 99,
      user_id: 1,
      product_id: 1,
      quantity: 2,
    });

    await expect(
      CartService.updateQuantity(1, 99, 8)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Số lượng vượt quá tồn kho (chỉ còn 5 sản phẩm).",
    });

    expect(updateCalled).toBe(false);
  });

  it("Cho phép thêm vào giỏ khi số lượng bằng tồn kho", async () => {
    const result = await CartService.add(1, 1, 5);

    expect(createCalled).toBe(true);
    expect(result.quantity).toBe(5);
    expect(CartRepository.create).toHaveBeenCalledWith(1, 1, 5);
  });
});
