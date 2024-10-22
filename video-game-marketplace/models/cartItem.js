const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


// Define the CartItem model
const CartItem = sequelize.define('CartItem', {
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cart, // Reference to the Cart model
      key: 'id',
    },
    onDelete: 'CASCADE', // Optional: Deletes cart items when the cart is deleted
  }
,
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default quantity is 1
  },
}, {
  tableName: 'cart_items', // Specify the table name if not the default
  timestamps: true, // Include createdAt and updatedAt fields
});


module.exports = CartItem;
