const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');

// Routes publiques
router.get('/', formationController.getAllFormations);
router.get('/level/:level', formationController.getFormationsByLevel);
router.get('/:id', formationController.getFormationById);

// Routes admin (à protéger plus tard avec middleware auth)
router.post('/', formationController.createFormation);
router.put('/:id', formationController.updateFormation);
router.delete('/:id', formationController.deleteFormation);

module.exports = router;