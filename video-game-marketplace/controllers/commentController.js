const Comment = require('../models/comment');
const Game = require('../models/game');

// Obtener todos los comentarios de un juego
exports.getCommentsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const comments = await Comment.findAll({
      where: { gameId },
      include: ['User']  // Para incluir información del usuario que dejó el comentario
    });

    if (comments.length === 0) {
      return res.status(404).json({ error: 'No comments found for this game' });
    }

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

// Agregar un comentario a un juego
exports.addCommentToGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;  // ID del usuario autenticado

    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const comment = await Comment.create({
      content,
      rating,
      gameId,
      userId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
};

// Eliminar un comentario
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;  // ID del usuario autenticado

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
};