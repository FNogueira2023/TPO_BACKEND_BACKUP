const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Company = require('../models/company');

// Registrar un nuevo usuario
exports.signup = async (req, res) => {
  try {
    const { name, lastName, email, password, birthDate, userType } = req.body;



    // Verificar si el usuario ya existe
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Crear un nuevo usuario
    user = await User.create({ name, lastName, email, password, birthDate,userType });

    // Generar un token JWT
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    // If the user is a company, create a company record
    if (userType === 'company') {

      try {
        const company = await Company.create({
          name,
          userId: user.id,
        });
        console.log(user)
        console.log('Company created:', company);
      } catch (companyError) {
        console.error('Error creating company:', companyError);
        return res.status(500).json({ error: 'Error creating company' });
      }
    }

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        userType: user.userType
      }
    });
  } catch (error) {
    // res.status(500).json({ error: 'Error registering user' });
    res.status(500).json({ error: error });
  }
};

// Iniciar sesión

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validar la contraseña
    const isValidPassword = await user.validPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};


// Obtener el perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'lastName', 'email', 'birthDate', 'userType'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};



