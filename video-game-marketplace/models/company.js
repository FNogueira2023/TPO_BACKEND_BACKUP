const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('./user');

const Company = sequelize.define('Company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,  // El logo puede ser opcional
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,  // Descripción opcional
  },
  userId: { // New foreign key to associate with User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },

  
})

module.exports = Company;