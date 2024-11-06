const User = require('../models/user');
const Company = require('../models/company');
const CompanyController = require('./companyController');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.signup = async (req, res) => {
    try {
        const { name, lastName, email, password, birthDate, userType } = req.body;

        // Check if the password is present
        if (!password) {
            return res.status(400).json({ error: 'Password is required.' });
        }

        // Check if the user already exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password before creating the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        user = await User.create({
            name,
            lastName,
            email,
            password: hashedPassword, // Store the hashed password
            birthDate,
            userType
        });

        // JWT token creation and response handling
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                birthDate: user.birthDate,
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ error: 'Failed to create user. Please try again later.' });
    }
};

// loguearse
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("User not found with email:", email); // Debugging
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Validate password
        const isPasswordValid = await user.validPassword(password);
        if (!isPasswordValid) {
            console.log("Invalid password for user:", email); // Debugging
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
                userType: user.userType,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
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

