const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Game = require('../models/game');
const { Op, Sequelize } = require('sequelize');

// Utility function to get or create the cart for a user
const getOrCreateCartAux = async (userId) => {
  const [cart, created] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId, totalPrice: 0 },
  });
  return cart;
};

// Create or find an existing cart for the user
exports.getOrCreateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getOrCreateCartAux(userId);
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error creating or finding cart' });
  }
};

// Get cart details by userId
exports.getCartByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { userId },
      include: { model: CartItem, include: [Game] },
    });

    if (!cart) return res.status(404).json({ error: 'Cart not found for this user' });
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart by user ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add item to cart, create cart if it doesn't exist
exports.addItemToCart = async (req, res) => {
  try {
    const { gameId, quantity } = req.body;
    const userId = req.user.id;
    const cart = await getOrCreateCartAux(userId);

    const game = await Game.findByPk(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const [cartItem, itemCreated] = await CartItem.findOrCreate({
      where: { cartId: cart.id, gameId },
      defaults: { quantity },
    });

    if (!itemCreated) {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    cart.totalPrice = Sequelize.literal(`totalPrice + ${game.price * quantity}`);
    await cart.save();

    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Error adding item to cart' });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user.id;
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ error: 'Cart not found for the user' });

    const cartItem = await CartItem.findOne({ where: { cartId: cart.id, gameId } });
    if (!cartItem) return res.status(404).json({ error: 'Item not found in cart' });

    const game = await Game.findByPk(gameId);
    cart.totalPrice = Sequelize.literal(`totalPrice - ${game.price * cartItem.quantity}`);
    await cart.save();
    await cartItem.destroy();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error removing item from cart' });
  }
};

// Checkout cart
exports.checkoutCart = async (req, res) => {
  const t = await Sequelize.transaction();
  try {
    const userId = req.user.id;
    const { paymentSimulation } = req.body;

    const cart = await Cart.findOne({
      where: { userId },
      include: { model: CartItem, include: [Game] },
      transaction: t,
    });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    if (paymentSimulation === 'success') {
      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
      cart.totalPrice = 0;
      await cart.save({ transaction: t });
      await t.commit();
      return res.status(200).json({ message: 'Checkout successful' });
    } else {
      await t.rollback();
      return res.status(400).json({ error: 'Payment simulation failed' });
    }
  } catch (error) {
    await t.rollback();
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Error during checkout' });
  }
};


// Get all cart items for the user's cart
exports.getAllCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the cart associated with the user
    const cart = await Cart.findOne({
      where: { userId }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for this user' });
    }

    // Use cartId to find all cart items
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id }
    });

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
