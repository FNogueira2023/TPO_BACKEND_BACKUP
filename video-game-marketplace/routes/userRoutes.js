const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas de autenticación
router.post('/users/signup', userController.signup);
router.post('/users/login', userController.login);

router.put('/users/update/:userId',authMiddleware, userController.updateUser);

// Rutas protegidas
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;
