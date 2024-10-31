const Wishlist = require('../models/wishlist');
const WishlistItem = require('../models/wishlistItem');
const Game = require('../models/game');

// Get or create a user's wishlist
exports.createWishlist = async (req, res) => {
  try {
    const { userId } = req.body; // Assume userId is sent in the request body
    const [wishlist, created] = await Wishlist.findOrCreate({
      where: { userId },
      defaults: { userId } // This sets the userId if creating a new wishlist
    });

    if (created) {
      // New wishlist created
      return res.status(201).json(wishlist);
    } else {
      // Wishlist already exists
      return res.status(200).json(wishlist);
    }
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
    console.log(error.message);
  }
};

// Add a game to the wishlist, creating wishlist and wishlistItem if necessary
exports.addItemToWishlist = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user.id;

    // Check if a wishlist exists for the user; if not, create one
    const [wishlist] = await Wishlist.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    // Check if the game exists
    const game = await Game.findByPk(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    // Explicitly create the WishlistItem without checking for duplicates
    const wishlistItem = await WishlistItem.create({
      wishlistId: wishlist.id,
      gameId: gameId,
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({ error: 'Error adding item to wishlist' });
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
    const { itemId } = req.params;
    const deletedItem = await WishlistItem.destroy({ where: { id: itemId } });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};