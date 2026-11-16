const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CartRepository {
  static async findByUserAndProduct(userId, productId) {
    return await prisma.cart_items.findFirst({
      where: {
        user_id: Number(userId),
        product_id: Number(productId),
      },
    });
  }

  static async findAllByUserId(userId) {
    return await prisma.cart_items.findMany({
      where: { user_id: Number(userId) },
      include: {
        products: {
          select: {
            product_id: true,
            product_name: true,
            price: true,
            stock: true,
            image: true,
          },
        },
      },
    });
  }

  static async create(userId, productId, quantity) {
    return await prisma.cart_items.create({
      data: {
        user_id: Number(userId),
        product_id: Number(productId),
        quantity: Number(quantity),
      },
    });
  }

  static async updateQuantity(cartItemId, quantity) {
    return await prisma.cart_items.update({
      where: { cart_item_id: Number(cartItemId) },
      data: { quantity: Number(quantity) },
    });
  }
}

module.exports = CartRepository;