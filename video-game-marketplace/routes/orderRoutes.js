const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para gestionar órdenes
router.post('/orders', authMiddleware, orderController.createOrder);  // Crear una orden
router.get('/orders', authMiddleware, orderController.getUserOrders);
router.get('/orders/all', authMiddleware, orderController.getOrderItems);
router.get('/orders/:orderId', authMiddleware, orderController.getOrderById);  // Obtener detalles de una orden específica

module.exports = router;