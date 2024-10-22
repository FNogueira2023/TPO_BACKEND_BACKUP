const express = require('express');
const paymentMethodController = require('../controllers/paymentMethodController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para métodos de pago
router.post('/payment-methods', authMiddleware, paymentMethodController.addPaymentMethod);
router.get('/payment-methods', authMiddleware, paymentMethodController.getPaymentMethods);
router.delete('/payment-methods/:paymentMethodId', authMiddleware, paymentMethodController.deletePaymentMethod);

// Ruta para simular un pago
router.post('/payment-methods/simulate-payment', authMiddleware, paymentMethodController.simulatePayment);

module.exports = router;