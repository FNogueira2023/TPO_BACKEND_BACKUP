const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuit: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Company;