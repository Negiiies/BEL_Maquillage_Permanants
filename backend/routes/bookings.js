// backend/routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

// Routes client (authentification client requise)
router.post('/', authController.clientAuthMiddleware, bookingController.createBooking);
router.get('/my-bookings', authController.clientAuthMiddleware, bookingController.getClientBookings);
router.get('/client/:id', authController.clientAuthMiddleware, bookingController.getBookingById);
router.put('/:id/cancel', authController.clientAuthMiddleware, bookingController.cancelBooking);

// Routes admin (authentification admin requise)
router.get('/', adminController.authMiddleware, bookingController.getAllBookings);
router.get('/stats', adminController.authMiddleware, bookingController.getBookingStats);
router.put('/:id/status', adminController.authMiddleware, bookingController.updateBookingStatus);

module.exports = router;