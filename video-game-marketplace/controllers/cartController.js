const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Game = require('../models/game');

// Crear un nuevo carrito
exports.createCart = async (req, res) => {
  try {
    const userId = req.user.id;  // ID del usuario autenticado
    const cart = await Cart.create({ userId });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error creating cart' });
  }
};

// Obtener detalles de un carrito
exports.getCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cart = await Cart.findByPk(cartId, {
      include: { model: CartItem, include: [Game] }
    });
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart details' });
  }
};

// Agregar un juego al carrito
exports.addItemToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { gameId, quantity } = req.body;

    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    let cartItem = await CartItem.findOne({ where: { cartId, gameId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cartId, gameId, quantity });
    }

    // Actualizar el precio total del carrito
    const cart = await Cart.findByPk(cartId);
    cart.totalPrice += game.price * quantity;
    await cart.save();

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Error adding item to cart' });
  }
};

// Quitar un juego del carrito
exports.removeItemFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { gameId } = req.body;

    const cartItem = await CartItem.findOne({ where: { cartId, gameId } });
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    const game = await Game.findByPk(gameId);

    // Actualizar el precio total del carrito
    const cart = await Cart.findByPk(cartId);
    cart.totalPrice -= game.price * cartItem.quantity;
    await cart.save();

    // Eliminar el item del carrito
    await cartItem.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error removing item from cart' });
  }
};

// Checkout del carrito (convertir a orden)
exports.checkoutCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { paymentSimulation } = req.body;  // Recibe un parámetro para simular el pago

    // Obtener el carrito con sus items
    const cart = await Cart.findByPk(cartId, {
        include: { model: CartItem, include: [Game] }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Simulación de pago
    if (paymentSimulation === 'success') {
        // Simula que el pago fue exitoso
        console.log('Payment simulated successfully');
  
        // Después de procesar el pago, vaciar el carrito
        await CartItem.destroy({ where: { cartId } });
        cart.totalPrice = 0;
        await cart.save();
  
        return res.status(200).json({ message: 'Checkout successful' });
      } else if (paymentSimulation === 'fail') {
        // Simula que el pago falló
        console.log('Payment simulation failed');
        return res.status(400).json({ error: 'Payment simulation failed' });
      } else {
        // Si no se recibe un valor válido, se asume que el pago falla
        return res.status(400).json({ error: 'Invalid payment simulation' });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ error: 'Error during checkout' });
    }
};
