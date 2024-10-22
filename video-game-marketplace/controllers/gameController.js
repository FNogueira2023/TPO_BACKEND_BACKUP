const Game = require('../models/game');

// Create a new game
exports.createGame = async (req, res) => {
  try {
    const { name, description, price, category, os, language, playerMode, gameRating } = req.body;
    const companyId = req.user.companyId;  // ID of the authenticated company

    const newGame = await Game.create({
      name,
      description,
      price,
      category,
      os,
      language,
      playerMode,
      gameRating,
      companyId,
    });

    res.status(201).json(newGame);
  } catch (error) {
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
    const { name, description, price, category, os, language, playerMode, gameRating } = req.body;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found or not owned by this company' });
    }

    // Update fields if provided in the request body
    game.name = name || game.name;
    game.description = description || game.description;
    game.price = price || game.price;
    game.category = category || game.category;
    game.os = os || game.os;
    game.language = language || game.language;
    game.playerMode = playerMode || game.playerMode;
    game.gameRating = gameRating || game.gameRating;

    await game.save();
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: 'Error updating game' });
  }
};

// Delete a game
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
