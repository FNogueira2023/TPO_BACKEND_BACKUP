const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Game = require('../models/game');

// Crear una nueva orden
exports.createOrder = async (req, res) => {
  try {
    const { games, totalPrice } = req.body;  // Lista de juegos y precio total
    const userId = req.user.id;  // ID del usuario autenticado

    // Crear la orden
    const newOrder = await Order.create({
      totalPrice,
      userId,
      status: 'completed',  // Suponemos que el pago fue exitoso
    });

    // Crear los elementos de la orden (OrderItems)
    const orderItems = await Promise.all(
      games.map(async (game) => {
        const gameData = await Game.findByPk(game.gameId);
        if (!gameData) {
          return res.status(404).json({ error: 'Game not found' });
        }

        return await OrderItem.create({
          orderId: newOrder.id,
          gameId: game.gameId,
          quantity: game.quantity,
          price: gameData.price,
        });
      })
    );

    res.status(201).json({ order: newOrder, orderItems });
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
      where: { userId },
      include: [OrderItem],  // Incluye los items de la orden
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