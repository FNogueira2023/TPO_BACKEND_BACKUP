const express = require('express');
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para juegos
router.post('/games', authMiddleware, gameController.createGame);
router.get('/games', gameController.getAllGames);
router.get('/games/:gameId', gameController.getGameById);
router.put('/games/:gameId', authMiddleware, gameController.updateGame);
router.delete('/games/:gameId', authMiddleware, gameController.deleteGame);

// Publicar y despublicar juegos
router.post('/games/:gameId/publish', authMiddleware, gameController.publishGame);
router.post('/games/:gameId/unpublish', authMiddleware, gameController.unpublishGame);

module.exports = router;