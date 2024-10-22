const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default quantity is 1
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

}, {
  tableName: 'order_items', // Specify the table name if not the default
  timestamps: true, // Automatically add createdAt and updatedAt fields
});


module.exports = OrderItem;
