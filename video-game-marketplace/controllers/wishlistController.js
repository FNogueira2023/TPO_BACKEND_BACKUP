const Wishlist = require('../models/wishlist');
const WishlistItem = require('../models/wishlistItem');
const Game = require('../models/game');

// Create a new wishlist
exports.createWishlist = async (req, res) => {
  try {
    const { userId } = req.body; // Assume userId is sent in the request body
    const wishlist = await Wishlist.create({ userId });
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params
    const wishlist = await Wishlist.findOne({ where: { userId } });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a game to the wishlist
exports.addItemToWishlist = async (req, res) => {
  try {
    const { wishlistId, gameId } = req.body; // Assume wishlistId and gameId are sent in the request body
    const wishlistItem = await WishlistItem.create({ wishlistId, gameId });
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get items in a wishlist
exports.getWishlistItems = async (req, res) => {
  try {
    const { wishlistId } = req.params; // Get wishlistId from request params
    const items = await WishlistItem.findAll({
      where: { wishlistId },
      include: [{ model: Game }], // Include game details
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a game from the wishlist
exports.removeItemFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params; // Get itemId from request params
    const deletedItem = await WishlistItem.destroy({ where: { id: itemId } });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};