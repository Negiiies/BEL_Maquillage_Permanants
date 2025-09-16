const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Route publique pour envoyer un message
router.post('/', contactController.sendContactMessage);

// Routes admin (à protéger plus tard avec middleware auth)
router.get('/', contactController.getAllContacts);
router.get('/stats', contactController.getContactStats);
router.get('/:id', contactController.getContactById);
router.patch('/:id/read', contactController.markAsRead);
router.delete('/:id', contactController.deleteContact);

module.exports = router;