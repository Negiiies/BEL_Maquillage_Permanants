// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');

// ✅ Routes sensibles AVEC rate limiting (protection bruteforce)
router.post('/register', authLimiter, authController.registerClient);
router.post('/login', authLimiter, authController.loginClient);

// ✅ Routes normales SANS rate limiting
router.post('/logout', authController.logoutClient);
router.get('/verify', authController.verifyClientToken);

// ✅ Routes protégées SANS rate limiting (déjà sécurisées par JWT)
router.get('/profile', authController.clientAuthMiddleware, authController.getClientProfile);
router.put('/profile', authController.clientAuthMiddleware, authController.updateClientProfile);

// ========================================
// ROUTES MOT DE PASSE
// ========================================

// Mot de passe oublié (public)
router.post('/forgot-password', authController.forgotPassword);

// Réinitialiser mot de passe avec token (public)
router.post('/reset-password', authController.resetPassword);

// Changer mot de passe (authentifié)
router.put('/change-password', authController.clientAuthMiddleware, authController.changePassword);

module.exports = router;