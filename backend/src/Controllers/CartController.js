const CartService = require('../Services/CartService');

class CartController {
  static async addToCart(req, res) {
    try {
      const userId = req.user?.user_id ?? req.user?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.' });
      }

      const { productId, qty } = req.body;
      const item = await CartService.add(userId, productId, qty ?? 1);

      return res.status(200).json({
        message: 'Đã thêm sản phẩm vào giỏ hàng.',
        data: item,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: error.message || 'Lỗi máy chủ khi thêm vào giỏ hàng.',
      });
    }
  }

  static async getCart(req, res) {
    try {
      const userId = req.user?.user_id ?? req.user?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để xem giỏ hàng.' });
      }

      const data = await CartService.getCart(userId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateQuantity(req, res) {
    try {
      const userId = req.user?.user_id ?? req.user?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để cập nhật giỏ hàng.' });
      }

      const { cartItemId } = req.params;
      const { qty } = req.body;
      const updated = await CartService.updateQuantity(userId, cartItemId, qty);

      return res.status(200).json({
        message: 'Đã cập nhật số lượng sản phẩm.',
        data: updated,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: error.message || 'Lỗi máy chủ khi cập nhật giỏ hàng.',
      });
    }
  }

  static async removeItem(req, res) {
    try {
      const userId = req.user?.user_id ?? req.user?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để xóa sản phẩm.' });
      }

      const { cartItemId } = req.params;
      await CartService.removeItem(userId, cartItemId);

      return res.status(200).json({
        message: 'Đã xóa sản phẩm khỏi giỏ hàng.',
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: error.message || 'Lỗi máy chủ khi xóa sản phẩm.',
      });
    }
  }
}

module.exports = CartController;