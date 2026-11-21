const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// Mock PrismaClient trước khi nạp CartService
const mockPrisma = {
  products: {
    findUnique: async () => null,
  },
};

const prismaModule = require('@prisma/client');
const OriginalPrismaClient = prismaModule.PrismaClient;
prismaModule.PrismaClient = function () {
  return mockPrisma;
};

const CartRepository = require('../src/Repositories/CartRepository');
const CartService = require('../src/Services/CartService');

// Khôi phục PrismaClient gốc sau khi CartService đã khởi tạo xong
prismaModule.PrismaClient = OriginalPrismaClient;

describe('CartService - Kiểm thử tồn kho khi thêm/cập nhật giỏ hàng', () => {
  let createCalled = false;
  let updateCalled = false;

  beforeEach(() => {
    createCalled = false;
    updateCalled = false;

    // Reset mock mặc định trước mỗi test case
    mockPrisma.products.findUnique = async () => ({
      product_id: 1,
      product_name: 'Áo thun test',
      stock: 5,
    });

    CartRepository.findByUserAndProduct = async () => null;
    CartRepository.create = async (userId, productId, qty) => {
      createCalled = true;
      return { cart_item_id: 10, user_id: userId, product_id: productId, quantity: qty };
    };
    CartRepository.updateQuantity = async (cartItemId, qty) => {
      updateCalled = true;
      return { cart_item_id: cartItemId, quantity: qty };
    };
  });

  it('Từ chối thêm mới vào giỏ khi số lượng vượt quá tồn kho', async () => {
    await assert.rejects(
      async () => {
        await CartService.add(1, 1, 6); // Tồn kho = 5, thêm 6
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Số lượng vượt quá tồn kho (chỉ còn 5 sản phẩm).');
        return true;
      }
    );

    assert.equal(createCalled, false);
    assert.equal(updateCalled, false);
  });

  it('Từ chối khi tổng số lượng đã có trong giỏ + số lượng thêm mới vượt tồn kho', async () => {
    // Giỏ hàng đã có sẵn 3 sản phẩm, tồn kho tối đa là 5
    CartRepository.findByUserAndProduct = async () => ({
      cart_item_id: 99,
      user_id: 1,
      product_id: 1,
      quantity: 3,
    });

    await assert.rejects(
      async () => {
        await CartService.add(1, 1, 3); // 3 + 3 = 6 > 5
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Số lượng vượt quá tồn kho (chỉ còn 5 sản phẩm).');
        return true;
      }
    );

    assert.equal(updateCalled, false);
  });

  it('Từ chối thêm vào giỏ khi sản phẩm đã hết hàng (stock = 0)', async () => {
    mockPrisma.products.findUnique = async () => ({
      product_id: 1,
      product_name: 'Áo thun hết hàng',
      stock: 0,
    });

    await assert.rejects(
      async () => {
        await CartService.add(1, 1, 1);
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Sản phẩm hiện đã hết hàng.');
        return true;
      }
    );

    assert.equal(createCalled, false);
  });

  it('Từ chối cập nhật số lượng trong giỏ vượt quá tồn kho', async () => {
    CartRepository.findById = async () => ({
      cart_item_id: 99,
      user_id: 1,
      product_id: 1,
      quantity: 2,
    });

    await assert.rejects(
      async () => {
        await CartService.updateQuantity(1, 99, 8); // Tồn kho = 5, cập nhật lên 8
      },
      (err) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.message, 'Số lượng vượt quá tồn kho (chỉ còn 5 sản phẩm).');
        return true;
      }
    );

    assert.equal(updateCalled, false);
  });

  it('Cho phép thêm vào giỏ khi số lượng nhỏ hơn hoặc bằng tồn kho', async () => {
    const result = await CartService.add(1, 1, 5); // Tồn kho = 5, thêm 5

    assert.equal(createCalled, true);
    assert.equal(result.quantity, 5);
  });
});