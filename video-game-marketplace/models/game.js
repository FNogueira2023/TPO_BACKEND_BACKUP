const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./company');  // Relación con Company

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
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: 1, // Minimum rating is 1
      max: 4, // Maximum rating is 4
    }
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  }, os: {
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
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  imageUrl: {
    type: DataTypes.STRING,  // URL de la imagen
    allowNull: true,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'id',
    },
  },
});

module.exports = Game;