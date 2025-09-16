const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes publiques (pour la connexion)
router.post('/login', adminController.loginAdmin);
router.post('/setup', adminController.createAdmin); // Pour créer le premier admin
router.get('/verify', adminController.verifyAdminToken);

// Routes protégées (nécessitent une authentification)
router.get('/dashboard', adminController.authMiddleware, adminController.getDashboardStats);

module.exports = router;