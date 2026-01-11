// backend/routes/client.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ================================
// MIDDLEWARE : Toutes les routes nécessitent l'authentification client
// ================================
router.use(authController.clientAuthMiddleware);

// ================================
// GESTION DU COMPTE CLIENT
// ================================

// Récupérer le profil
router.get('/profile', authController.getClientProfile);

// Mettre à jour le profil
router.put('/profile', authController.updateClientProfile);

// ⭐ SUPPRESSION DE COMPTE (RGPD)
router.delete('/account', authController.deleteClientAccount);

module.exports = router;