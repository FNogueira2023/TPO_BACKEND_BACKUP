const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Game = require('./game');

const Wishlist = sequelize.define('Wishlist', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Game,
      key: 'id',
    },
  }
}, {
  uniqueKeys: {
    unique_wishlist: {
      fields: ['userId', 'gameId']
    }
  }
});

module.exports = Wishlist;