const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Wishlist = require('./wishlist');  // Assuming Wishlist model is in the same directory
const Game = require('./game');  // Assuming Game model is in the same directory

const WishlistItem = sequelize.define('WishlistItem', {
    wishlistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Wishlist,
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
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt
});


module.exports = WishlistItem;
