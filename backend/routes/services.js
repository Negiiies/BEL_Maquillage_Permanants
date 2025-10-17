// backend/routes/services.js - VERSION CORRIGÉE
const express = require('express');
const router = express.Router(); // ✅ Cette ligne était manquante !
const serviceController = require('../controllers/serviceController');
const adminController = require('../controllers/adminController');

// ================================
// ROUTES PUBLIQUES
// ================================
router.get('/', serviceController.getAllServices);
router.get('/category/:category', serviceController.getServicesByCategory);
router.get('/:id', serviceController.getServiceById);

// ================================
// ROUTES ADMIN (protégées par middleware)
// ================================
router.get('/admin/all', adminController.authMiddleware, serviceController.getAllServicesAdmin);
router.post('/admin', adminController.authMiddleware, serviceController.createService);
router.put('/admin/:id', adminController.authMiddleware, serviceController.updateService);
router.delete('/admin/:id', adminController.authMiddleware, serviceController.deleteService);
router.patch('/admin/reorder', adminController.authMiddleware, serviceController.reorderServices);
router.get('/admin/stats', adminController.authMiddleware, serviceController.getServicesStats);

module.exports = router;