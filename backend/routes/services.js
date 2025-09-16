const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Routes publiques
router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getServiceById);

// Routes admin (à protéger plus tard avec middleware auth)
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;