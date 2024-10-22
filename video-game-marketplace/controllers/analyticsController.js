const Game = require('../models/game');
const Order = require('../models/order');
const { Op } = require('sequelize');

// Obtener analítica de los juegos de la compañía
exports.getCompanyAnalytics = async (req, res) => {
  try {
    const { category, period, page = 1, pageSize = 5 } = req.query;

    // Filtros de búsqueda
    const filters = {};
    if (category) {
      filters.category = category;
    }

    // Filtro por periodo (YYYY-MM)
    let periodFilter = {};
    if (period) {
      const [year, month] = period.split('-');
      periodFilter = {
        [Op.and]: [
          sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
          sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month)
        ]
      };
    }

    // Buscar juegos de la compañía autenticada
    const games = await Game.findAll({
      where: filters,
      include: [{
        model: Order,
        where: period ? periodFilter : {},
        required: false,  // Incluye juegos aunque no tengan órdenes
      }],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize)
    });

    // Calcular los datos analíticos para cada juego
    const gameAnalytics = games.map(game => {
      const totalSales = game.Orders.reduce((acc, order) => acc + order.totalPrice, 0);
      const totalOrders = game.Orders.length;
      return {
        gameId: game.id,
        gameName: game.name,
        totalSales,
        totalOrders,
        averageRating: game.rating,  // Supuesto que tienes un campo rating
        views: game.views || 0,  // Supuesto que tienes un campo views
        wishlistAdditions: game.wishlistAdditions || 0  // Supuesto que tienes un campo wishlistAdditions
      };
    });

    // Responder con los datos analíticos
    res.json({
      totalSales: gameAnalytics.reduce((acc, game) => acc + game.totalSales, 0),
      totalOrders: gameAnalytics.reduce((acc, game) => acc + game.totalOrders, 0),
      gameAnalytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
};