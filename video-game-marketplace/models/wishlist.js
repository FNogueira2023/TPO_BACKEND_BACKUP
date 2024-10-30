const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');  // Assuming User model is in the same directory

const Wishlist = sequelize.define('Wishlist', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});


module.exports = Wishlist;
