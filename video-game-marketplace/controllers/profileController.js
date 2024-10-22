const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Obtener el perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;  // ID del usuario autenticado

    const user = await User.findByPk(userId, {
      attributes: ['username', 'email', 'avatar', 'bio', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

// Actualizar el perfil del usuario autenticado
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, avatar, bio, password } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Actualizar campos opcionales
    user.username = username || user.username;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;
    user.bio = bio || user.bio;

    // Si se proporciona una nueva contraseña, actualizarla (hash)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// Eliminar el perfil del usuario autenticado
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting profile' });
  }
};