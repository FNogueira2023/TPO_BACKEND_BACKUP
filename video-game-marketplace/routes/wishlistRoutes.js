const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new wishlist
// router.post('/wishlists',authMiddleware, wishlistController.getOrCreateWishlist);

// Get a user's wishlist
router.get('/wishlists/:userId',authMiddleware, wishlistController.getWishlist);

// Add a game to the wishlist
router.post('/wishlists/items',authMiddleware, wishlistController.addItemToWishlist);

// Get items in a wishlist
router.get('/wishlists/:wishlistId/items',authMiddleware, wishlistController.getWishlistItems);

// Remove a game from the wishlist
router.delete('/wishlists/items/:itemId',authMiddleware, wishlistController.removeItemFromWishlist);

module.exports = router;
