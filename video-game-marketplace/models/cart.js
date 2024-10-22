const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Reference to the User model
      key: 'id',
    },
    unique: true, // Ensure a user can only have one cart
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0, // Default total price is 0
  }

}, {
  tableName: 'carts', // Specify the table name if not the default
  timestamps: true, // Include createdAt and updatedAt fields
});



module.exports = Cart;
