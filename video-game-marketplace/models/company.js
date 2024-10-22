const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuit: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  hooks: {
    beforeCreate: async (company) => {
      // Hash the password here if needed
    },
  },
});

module.exports = Company;
