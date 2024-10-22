const PaymentMethod = require('../models/paymentMethod');

// Agregar un nuevo método de pago
exports.addPaymentMethod = async (req, res) => {
  try {
    const { type, provider, accountNumber, expiryDate } = req.body;
    const userId = req.user.id;  // ID del usuario autenticado

    // Crear un nuevo método de pago
    const newPaymentMethod = await PaymentMethod.create({
      type,
      provider,
      accountNumber,
      expiryDate,
      userId,
    });

    res.status(201).json(newPaymentMethod);
  } catch (error) {
    res.status(500).json({ error: 'Error adding payment method' });
  }
};

// Obtener todos los métodos de pago del usuario
exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;

    const paymentMethods = await PaymentMethod.findAll({
      where: { userId },
    });

    if (paymentMethods.length === 0) {
      return res.status(404).json({ error: 'No payment methods found' });
    }

    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment methods' });
  }
};

// Eliminar un método de pago
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const userId = req.user.id;

    const paymentMethod = await PaymentMethod.findOne({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    await paymentMethod.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting payment method' });
  }
};

// Simular el uso de un método de pago
exports.simulatePayment = async (req, res) => {
  try {
    const { paymentMethodId, amount } = req.body;
    const userId = req.user.id;

    // Buscar el método de pago del usuario
    const paymentMethod = await PaymentMethod.findOne({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    // Simular el pago
    if (amount > 0) {
      res.json({
        message: `Payment of $${amount} successfully processed using ${paymentMethod.provider}.`,
        paymentMethod,
      });
    } else {
      res.status(400).json({ error: 'Invalid payment amount' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error simulating payment' });
  }
};