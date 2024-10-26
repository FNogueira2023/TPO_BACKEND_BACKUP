const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: true ,  // Ensure name is provided
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,  // Ensure lastName is provided
  },
  birthDate: {
    type: DataTypes.DATE,  // Use DATE type for birth date
    allowNull: true,       // Allow null if not provided
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
  avatar: {
    type: DataTypes.STRING,  // URL de la imagen del avatar (opcional)
    allowNull: true,
  },
  bio: {
    type: DataTypes.TEXT,  // Descripción breve del usuario
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['customer', 'company']],
    },
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);  // Hash password
    },
  }
});

// Método para validar la contraseña
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
