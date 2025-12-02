// backend/routes/inscription.js
const express = require('express');
const router = express.Router();
const inscriptionController = require('../controllers/inscriptionController');

// Route publique - Envoyer une demande d'inscription
router.post('/', inscriptionController.sendInscriptionRequest);

module.exports = router;