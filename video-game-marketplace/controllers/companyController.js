const Company = require('../models/company');
const Game = require('../models/game');
const bcrypt = require('bcryptjs');

// Obtener el perfil de la compañía autenticada
exports.getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.companyId;  // Asumimos que req.user tiene el ID de la compañía
    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching company profile' });
  }
};

// Actualizar el perfil de la compañía autenticada
exports.updateCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { name, logo, description, email } = req.body;

    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    company.name = name || company.name;
    company.logo = logo || company.logo;
    company.description = description || company.description;
    company.email = email || company.email;

    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Error updating company profile' });
  }
};

// Crear una nueva compañía (por parte de un administrador)
exports.createCompany = async (req, res) => {
  try {
    const { name, logo, description, email } = req.body;

    const newCompany = await Company.create({
      name,
      logo,
      description,
      email,
    });

    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: 'Error creating company' });
  }
};

// Obtener todos los juegos de la compañía autenticada
exports.getCompanyGames = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const games = await Game.findAll({
      where: { companyId }
    });

    if (games.length === 0) {
      return res.status(404).json({ error: 'No games found for this company' });
    }

    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching company games' });
  }
};

// Company signup (register)
exports.companySignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if company with the same email or cuit already exists
    const existingCompany = await Company.findOne({ where: { email } });
    if (existingCompany) {
      return res.status(400).json({ error: 'Email is already in use' });
    }
    

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new company
    const newCompany = await Company.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Company registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering company' });
    console.log(error)
  }
};

// Company login
/*
exports.companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the company exists
    const company = await Company.findOne({ where: { email } });
    if (!company) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ companyId: company.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, company: { id: company.id, name: company.name, email: company.email } });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};
*/

