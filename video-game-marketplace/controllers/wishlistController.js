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

exports.addItemToWishlist = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user.id;

    // Check if the game exists
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Find or create the user's wishlist
    const [wishlist] = await Wishlist.findOrCreate({
      where: { userId },
      defaults: { userId },
    });

    // Check if the game is already in the wishlist
    const existingWishlistItem = await WishlistItem.findOne({
      where: {
        wishlistId: wishlist.id,
        gameId: gameId,
      },
    });

    if (existingWishlistItem) {
      return res.status(409).json({ error: 'Game is already in the wishlist' });
    }

    // Add the game to the wishlist
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
    const userId = req.user.id; // Assuming user ID is available in req.user from authMiddleware
    const wishlist = await Wishlist.findOne({ where: { userId } }); // Find the wishlist for the user

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found for this user.' });
    }

    const { id: wishlistId } = wishlist; // Get the wishlistId

    // Now fetch the items for the found wishlist
    const items = await WishlistItem.findAll({
      where: { wishlistId },
      include: [{ model: Game }], // Include game details
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching wishlist items:', error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};


// Remove a game from the wishlist
exports.removeItemFromWishlist = async (req, res) => {
  try {
    const { gameId } = req.body; // Get gameId from the request body

    // Check if gameId is provided
    if (!gameId) {
      return res.status(400).json({ message: 'gameId is required.' });
    }

    // Use gameId to find and delete the WishlistItem
    const deletedItem = await WishlistItem.destroy({ where: { gameId: gameId } });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(204).send(); // Successfully deleted
  } catch (error) {
    console.error('Error removing item from wishlist:', error); // Optional: log the error
    res.status(500).json({ message: error.message });
  }
};
