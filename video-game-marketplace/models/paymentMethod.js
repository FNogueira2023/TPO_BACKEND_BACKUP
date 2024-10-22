const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const PaymentMethod = sequelize.define('PaymentMethod', {
  type: {
    type: DataTypes.STRING,  // e.g., 'credit_card', 'paypal'
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,  // e.g., 'Visa', 'MasterCard', 'PayPal'
    allowNull: false,
  },
  accountNumber: {
    type: DataTypes.STRING,  // Ficticio (simulamos un número de cuenta o tarjeta)
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.STRING,  // Fecha de expiración en formato 'MM/YY' para tarjetas
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

module.exports = PaymentMethod;