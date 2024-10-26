const Company = require('../models/company');
const Game = require('../models/game');

// Obtener el perfil de la compañía autenticada
exports.getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.companyId;  // Asumimos que req.user tiene el ID de la compañía
    const company = await Company.findByPk(companyId, {
      attributes: { exclude: ['password'] }  // Exclude the password field for security
    });

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

    // Update only the fields that are provided in the request
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
    const { name, email } = req.body;

    // Ensure that required fields are provided
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if the company already exists
    const existingCompany = await Company.findOne({ where: { email } });
    if (existingCompany) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newCompany = await Company.create({
      name,
      email,  // Email is stored, password handling removed
    });

    res.status(201).json({
      id: newCompany.id,
      name: newCompany.name,
      email: newCompany.email,
      logo: newCompany.logo,
      description: newCompany.description,
    });
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
