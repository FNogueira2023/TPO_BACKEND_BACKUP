const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para gestionar la wishlist
router.post('/wishlist', authMiddleware, wishlistController.addToWishlist);  // Agregar a wishlist
router.get('/wishlist', authMiddleware, wishlistController.getWishlist);  // Obtener la wishlist
router.delete('/wishlist', authMiddleware, wishlistController.removeFromWishlist);  // Eliminar de wishlist

module.exports = router;