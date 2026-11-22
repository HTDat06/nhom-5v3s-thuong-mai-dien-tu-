const express = require('express');
const router = express.Router();
const CartController = require('../Controllers/CartController');
const { authenticate } = require('../Middlewares/authMiddleware');

router.get('/', authenticate, CartController.getCart);
router.post('/', authenticate, CartController.addToCart);
router.put('/:cartItemId', authenticate, CartController.updateQuantity);
router.delete('/', authenticate, CartController.clearCart);
router.delete('/:cartItemId', authenticate, CartController.removeItem);

module.exports = router;