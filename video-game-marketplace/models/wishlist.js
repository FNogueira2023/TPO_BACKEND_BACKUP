const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Wishlist = sequelize.define('Wishlist', {

}, {
  tableName: 'wishlists',
  timestamps: true,
  uniqueKeys: {
    unique_wishlist: {
      fields: ['userId', 'gameId'],
    },
  },
});

module.exports = Wishlist;
