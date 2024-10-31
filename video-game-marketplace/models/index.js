const Cart = require('./cart');
const CartItem = require('./cartItem');
const Game = require('./game');
const Comment = require('./comment');
const User = require('./user');
const Company = require('./company');
const Order = require('./order');
const OrderItem = require('./orderItem');
const PaymentMethod = require('./paymentMethod');
const Wishlist = require('./wishlist');
const WishlistItem = require('./wishlistItem');

// Cart Associations
Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// Game Associations
Game.hasMany(CartItem, { foreignKey: 'gameId' });
CartItem.belongsTo(Game, { foreignKey: 'gameId' });

// User and Cart Associations
User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Comment Associations
Game.hasMany(Comment, { foreignKey: 'gameId', onDelete: 'CASCADE' });
Comment.belongsTo(Game, { foreignKey: 'gameId' });
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// Company Associations
Company.hasMany(Game, { foreignKey: 'companyId', onDelete: 'CASCADE' });
Game.belongsTo(Company, { foreignKey: 'companyId' });

// Order Associations
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Game.hasMany(OrderItem, { foreignKey: 'gameId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Game, { foreignKey: 'gameId' });

// Payment Method Associations
User.hasMany(PaymentMethod, { foreignKey: 'userId', onDelete: 'CASCADE' });
PaymentMethod.belongsTo(User, { foreignKey: 'userId' });

// User and Company Association
User.hasOne(Company, {
    foreignKey: 'userId', // Foreign key in the Company model
    as: 'company',        // Alias for association
});

// Wishlist Associations
Wishlist.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlistId', onDelete: 'CASCADE' });
WishlistItem.belongsTo(Game, { foreignKey: 'gameId', onDelete: 'CASCADE' }); // Game association with WishlistItem
