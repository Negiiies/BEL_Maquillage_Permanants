// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes publiques (pas d'authentification requise)
router.post('/register', authController.registerClient);
router.post('/login', authController.loginClient);
router.post('/logout', authController.logoutClient);
router.get('/verify', authController.verifyClientToken);

// Routes protégées (authentification client requise)
router.get('/profile', authController.clientAuthMiddleware, authController.getClientProfile);
router.put('/profile', authController.clientAuthMiddleware, authController.updateClientProfile);

module.exports = router;