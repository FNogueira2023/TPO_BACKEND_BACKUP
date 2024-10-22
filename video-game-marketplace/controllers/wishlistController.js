const Wishlist = require('../models/wishlist');
const Game = require('../models/game');

// Agregar un juego a la wishlist del usuario autenticado
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameId } = req.body;

    // Verificar si el juego ya está en la wishlist del usuario
    const existingEntry = await Wishlist.findOne({ where: { userId, gameId } });
    if (existingEntry) {
      return res.status(400).json({ error: 'Game already in wishlist' });
    }

    // Agregar el juego a la wishlist
    const wishlistItem = await Wishlist.create({ userId, gameId });
    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Error adding to wishlist' });
  }
};

// Obtener la wishlist del usuario autenticado
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: { model: Game, attributes: ['id', 'name', 'price', 'description'] },
    });

    if (wishlist.length === 0) {
      return res.status(404).json({ error: 'No games in wishlist' });
    }

    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Error fetching wishlist' });
  }
};

// Eliminar un juego de la wishlist del usuario autenticado
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameId } = req.body;

    const wishlistItem = await Wishlist.findOne({ where: { userId, gameId } });

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Game not found in wishlist' });
    }

    await wishlistItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Error removing from wishlist' });
  }
};