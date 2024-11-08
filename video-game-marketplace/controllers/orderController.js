const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Game = require('../models/game');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

// Crear una nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { games, totalPrice } = req.body;  // List of games and total price
    const userId = req.user.id;  // ID of the authenticated user

    // Create the order
    const newOrder = await Order.create({
      totalPrice,
      userId,
      status: 'completed',  // Assume payment was successful
    });

    // Create the order items
    const orderItems = await Promise.all(
        games.map(async (game) => {
          const gameData = await Game.findByPk(game.gameId);
          if (!gameData) {
            throw new Error('Game not found');  // Trigger catch block if game is not found
          }

          return await OrderItem.create({
            orderId: newOrder.id,
            gameId: game.gameId,
            quantity: game.quantity,
            price: gameData.price,
          });
        })
    );

    // Find and delete the user's cart and associated cart items
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });  // Delete all cart items
      await cart.destroy();  // Delete the cart
    } else {
      console.warn(`No cart found for user with ID ${userId}`);
    }

    // Create a new empty cart for the user
    const newCart = await Cart.create({
      userId,
      totalPrice: 0, // Start with 0 total price
    });

    // Respond with the created order, its items, and the new empty cart
    res.status(201).json({ order: newOrder, orderItems, newCart });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
};

// Obtener todas las órdenes del usuario autenticado
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId }
    });

    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found' });
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Obtener todos los items de órdenes específicas
exports.getOrderItems = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all orders for the user
    const orders = await Order.findAll({
      where: { userId }
    });

    // If no orders are found, return an error
    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    // Extract the order IDs from the found orders
    const orderIds = orders.map(order => order.id);

    // Fetch all order items for the specified orders
    const orderItems = await OrderItem.findAll({
      where: {
        orderId: orderIds  // Filter by the order IDs
      }
    });

    // If no order items are found, return an error
    if (orderItems.length === 0) {
      return res.status(404).json({ error: 'No order items found for the specified orders' });
    }

    // Respond with the list of order items
    res.json(orderItems);
  } catch (error) {
    console.error('Error fetching order items from specific orders:', error);
    res.status(500).json({ error: 'Error fetching order items' });
  }
};


// Obtener detalles de una orden específica
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [OrderItem],
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
};