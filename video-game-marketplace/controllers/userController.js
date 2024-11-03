const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Company = require('../models/company');
const CompanyController = require('./companyController');


// Registrar un nuevo usuario
exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    const { name, lastName, email, password, birthDate, userType } = req.body;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Crear un nuevo usuario
    user = await User.create({ name, lastName, email, password, birthDate, userType });

    // Generar un token JWT
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        userType: user.userType,  // Include userType in response
      }
    });


    // Crear empresa si el usuario es de tipo 'company'
    if (userType === 'company') {
      const company = await Company.create({
        name, // You may want to change this to a different name if needed
        userId: user.id, // Associate the company with the user
      });
      console.log('Company created:', company);
    }



  } catch (error) {
    res.status(500).json({ error: error });
  }
};


// loguearse
// Login function for the user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        userType: user.userType, // Include userType in response
      },
    });
  } catch (error) {
    console.error('Error during login:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
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

