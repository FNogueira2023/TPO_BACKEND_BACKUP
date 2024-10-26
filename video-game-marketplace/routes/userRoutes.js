const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas de autenticación
router.post('/users/signup', userController.signup);
// router.post('/users/login', userController.login);

// Rutas protegidas
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,  // Información del usuario autenticado
  });
});

module.exports = router;
