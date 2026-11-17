const { PrismaClient } = require('@prisma/client');
const CartRepository = require('../Repositories/CartRepository');

const prisma = new PrismaClient();

class CartService {
  static async add(userId, productId, qty = 1) {
    const quantity = Number(qty);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      const error = new Error('Số lượng sản phẩm phải là số nguyên lớn hơn 0.');
      error.statusCode = 400;
      throw error;
    }

    const product = await prisma.products.findUnique({
      where: { product_id: Number(productId) },
    });

    if (!product) {
      const error = new Error('Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.');
      error.statusCode = 404;
      throw error;
    }

    if (product.stock <= 0) {
      const error = new Error('Sản phẩm hiện đã hết hàng.');
      error.statusCode = 400;
      throw error;
    }

    const existingItem = await CartRepository.findByUserAndProduct(userId, productId);
    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (newQuantity > product.stock) {
      const error = new Error(`Số lượng vượt quá tồn kho (chỉ còn ${product.stock} sản phẩm).`);
      error.statusCode = 400;
      throw error;
    }

    if (existingItem) {
      return await CartRepository.updateQuantity(existingItem.cart_item_id, newQuantity);
    }

    return await CartRepository.create(userId, productId, newQuantity);
  }

  static async getCart(userId) {
    const items = await CartRepository.findAllByUserId(userId);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.products?.price || 0) * item.quantity,
      0
    );
    return { items, totalQuantity, totalAmount };
  }

  static async updateQuantity(userId, cartItemId, qty) {
    const quantity = Number(qty);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      const error = new Error('Số lượng sản phẩm phải là số nguyên lớn hơn 0.');
      error.statusCode = 400;
      throw error;
    }

    const cartItem = await CartRepository.findById(cartItemId);
    if (!cartItem || cartItem.user_id !== Number(userId)) {
      const error = new Error('Không tìm thấy sản phẩm trong giỏ hàng.');
      error.statusCode = 404;
      throw error;
    }

    const product = await prisma.products.findUnique({
      where: { product_id: cartItem.product_id },
    });

    if (!product) {
      const error = new Error('Sản phẩm không tồn tại.');
      error.statusCode = 404;
      throw error;
    }

    if (product.stock <= 0) {
      const error = new Error('Sản phẩm hiện đã hết hàng.');
      error.statusCode = 400;
      throw error;
    }

    if (quantity > product.stock) {
      const error = new Error(`Số lượng vượt quá tồn kho (chỉ còn ${product.stock} sản phẩm).`);
      error.statusCode = 400;
      throw error;
    }

    return await CartRepository.updateQuantity(cartItemId, quantity);
  }

  static async removeItem(userId, cartItemId) {
    const cartItem = await CartRepository.findById(cartItemId);
    if (!cartItem || cartItem.user_id !== Number(userId)) {
      const error = new Error('Không tìm thấy sản phẩm trong giỏ hàng.');
      error.statusCode = 404;
      throw error;
    }

    return await CartRepository.delete(cartItemId);
  }
}

module.exports = CartService;