// backend/routes/timeslots.js
const express = require('express');
const router = express.Router();
const timeslotController = require('../controllers/timeslotController');
const adminController = require('../controllers/adminController');

// Routes publiques
router.get('/available', timeslotController.getAvailableTimeSlots);

// Routes admin (authentification admin requise)
router.post('/', adminController.authMiddleware, timeslotController.createTimeSlots);
router.get('/', adminController.authMiddleware, timeslotController.getAllTimeSlots);
router.put('/:id/availability', adminController.authMiddleware, timeslotController.updateTimeSlotAvailability);
router.delete('/:id', adminController.authMiddleware, timeslotController.deleteTimeSlot);

module.exports = router;