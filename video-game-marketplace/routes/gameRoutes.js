// gameRoutes.js
const express = require('express');
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig'); // Import the multer config

const router = express.Router();

// Routes for games
router.post('/games', authMiddleware, upload.single('image'), gameController.createGame);
router.get('/games', gameController.getAllGames);
router.get('/games/:gameId', gameController.getGameById);
router.put('/games/:gameId', authMiddleware, gameController.updateGame);
router.delete('/games/:gameId', authMiddleware, gameController.deleteGame);

// Publish and unpublish games
router.post('/games/:gameId/publish', authMiddleware, gameController.publishGame);
router.post('/games/:gameId/unpublish', authMiddleware, gameController.unpublishGame);

module.exports = router;
