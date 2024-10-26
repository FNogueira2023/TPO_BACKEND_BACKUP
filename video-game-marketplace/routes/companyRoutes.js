const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();



// Routes protected by authentication
router.get('/companies/profile', authMiddleware, companyController.getCompanyProfile);
router.put('/companies/profile', authMiddleware, companyController.updateCompanyProfile);
router.post('/companies', authMiddleware, companyController.createCompany);
router.get('/companies/games', authMiddleware, companyController.getCompanyGames);

module.exports = router;
