const express = require('express');
const router = express.Router();
const CartController = require('../Controllers/CartController');
const { authenticate } = require('../Middlewares/authMiddleware');

router.get('/', authenticate, CartController.getCart);
router.post('/', authenticate, CartController.addToCart);

module.exports = router;