const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Game = require('./game');

const Order = sequelize.define('Order', {
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',  // "pending", "completed", "cancelled", etc.
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

module.exports = Order;