const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const adminController = require('../controllers/adminController');

// ============================================
// ROUTES PUBLIQUES
// ============================================

// Récupérer toutes les formations actives
router.get('/', formationController.getAllFormations);

// Récupérer les formations par catégorie (ancien système)
router.get('/category/:category', formationController.getFormationsByCategory);

// 🆕 Récupérer les formations par sous-catégorie (nouveau système)
router.get('/subcategory/:subcategory', formationController.getFormationsBySubcategory);

// Récupérer une formation par ID
router.get('/:id', formationController.getFormationById);

// ============================================
// ROUTES ADMIN (protégées)
// ============================================

// Créer une formation
router.post('/', adminController.authMiddleware, formationController.createFormation);

// Mettre à jour une formation
router.put('/:id', adminController.authMiddleware, formationController.updateFormation);

// Supprimer une formation
router.delete('/:id', adminController.authMiddleware, formationController.deleteFormation);

module.exports = router;