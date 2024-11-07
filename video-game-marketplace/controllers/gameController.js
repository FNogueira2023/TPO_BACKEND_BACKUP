const Game = require('../models/game');
const path = require('path'); // Make sure path is available if needed for file handling

// Create a new game


exports.createGame = async (req, res) => {
  try {
    // Extract game data from the request body (without the image)
    const { name, genre, description, price, os, language, playerMode, companyId } = req.body;

    // Check if the image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Use the uploaded image file to set the imageURL (stored in 'public/gameImages/')
    const imageURL = `${req.file.filename}`;  // The relative URL to the saved image

    // Create the new game entry in the database
    const newGame = await Game.create({
      name,
      description,
      genre,
      price,
      os,
      language,
      playerMode,
      imageURL,  // Save the image URL in the game data
      companyId,
    });

    // Respond with the created game data
    res.status(201).json(newGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating game' });
  }
};


// Get all games (optionally filtered by category)
exports.getAllGames = async (req, res) => {
  try {
    const { category, page = 1, pageSize = 20 } = req.query;

    const filters = {};
    if (category) {
      filters.category = category;
    }

    const games = await Game.findAll({
      where: filters,
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
    });

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching games' });
  }
};

// Get a specific game by ID
exports.getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching game' });
  }
};

// Update a game
exports.updateGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { name, description, price, category, os, language, playerMode, gameRating, imageURL } = req.body;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found or not owned by this company' });
    }

    // Actualiza campos opcionales
    game.name = name || game.name;
    game.description = description || game.description;
    game.price = price || game.price;
    game.category = category || game.category;
    game.os = os || game.os;
    game.language = language || game.language;
    game.playerMode = playerMode || game.playerMode;
    game.gameRating = gameRating || game.gameRating;
    game.imageURL = imageURL || game.imageURL;

    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error updating game' });
  }
};

// Borrar un juego
exports.deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found or not owned by this company' });
    }

    await game.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting game' });
  }
};

// Publish a game
exports.publishGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found or not owned by this company' });
    }

    game.isPublished = true;
    await game.save();

    res.json({ message: 'Game published successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error publishing game' });
  }
};

// Unpublish a game
exports.unpublishGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found or not owned by this company' });
    }

    game.isPublished = false;
    await game.save();

    res.json({ message: 'Game unpublished successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error unpublishing game' });
  }
};
