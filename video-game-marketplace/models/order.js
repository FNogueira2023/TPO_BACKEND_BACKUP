const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    defaultValue: 'pending',  // Possible values: "pending", "completed", "cancelled", etc.
  },

}, {
  tableName: 'orders', // Specify the table name if not the default
  timestamps: true, // Automatically add createdAt and updatedAt fields
});


module.exports = Order;
