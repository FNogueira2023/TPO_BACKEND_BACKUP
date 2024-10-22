const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Game', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  os: {
    type: DataTypes.ENUM('Windows', 'Mac', 'Linux'), // Restrict to specific OS
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  playerMode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: 1, // Minimum rating is 1
      max: 4, // Maximum rating is 4
    },
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'games', // Specify table name if not the default 'games'
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});



module.exports = Game;
