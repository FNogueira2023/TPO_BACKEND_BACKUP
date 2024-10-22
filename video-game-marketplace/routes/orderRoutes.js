const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para gestionar órdenes
router.post('/orders', authMiddleware, orderController.createOrder);  // Crear una orden
router.get('/orders', authMiddleware, orderController.getUserOrders);  // Obtener todas las órdenes del usuario autenticado
router.get('/orders/:orderId', authMiddleware, orderController.getOrderById);  // Obtener detalles de una orden específica

module.exports = router;