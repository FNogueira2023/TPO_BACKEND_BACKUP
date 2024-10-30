const express = require('express');
const router = express.Router();
const wishlistController = require('./controllers/wishlistController');

// Create a new wishlist
router.post('/wishlists', wishlistController.createWishlist);

// Get a user's wishlist
router.get('/wishlists/:userId', wishlistController.getWishlist);

// Add a game to the wishlist
router.post('/wishlists/items', wishlistController.addItemToWishlist);

// Get items in a wishlist
router.get('/wishlists/:wishlistId/items', wishlistController.getWishlistItems);

// Remove a game from the wishlist
router.delete('/wishlists/items/:itemId', wishlistController.removeItemFromWishlist);

module.exports = router;
