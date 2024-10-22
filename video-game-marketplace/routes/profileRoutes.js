const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para gestionar el perfil del usuario
router.get('/profile', authMiddleware, profileController.getProfile);  // Obtener el perfil
router.put('/profile', authMiddleware, profileController.updateProfile);  // Actualizar el perfil
router.delete('/profile', authMiddleware, profileController.deleteProfile);  // Eliminar el perfil

module.exports = router;