// backend/routes/admin.js - VERSION CORRIGÉE
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const serviceController = require('../controllers/serviceController');
const timeslotController = require('../controllers/timeslotController');
const bookingController = require('../controllers/bookingController');
const contactController = require('../controllers/contactController');

// ================================
// ROUTES PUBLIQUES (authentification admin)
// ================================
router.post('/login', adminController.loginAdmin);
router.post('/setup', adminController.createAdmin);
router.get('/verify', adminController.verifyAdminToken);

// ================================
// MIDDLEWARE PROTECTION ADMIN
// ================================
// Toutes les routes suivantes nécessitent une authentification admin
router.use(adminController.authMiddleware);

// ================================
// DASHBOARD & STATISTIQUES GÉNÉRALES
// ================================
router.get('/dashboard', adminController.getDashboardStats);

// ================================
// GESTION DES SERVICES
// ================================
router.get('/services', serviceController.getAllServicesAdmin);
router.post('/services', serviceController.createService);
router.put('/services/:id', serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);
router.patch('/services/reorder', serviceController.reorderServices);
router.get('/services/stats', serviceController.getServicesStats);

// ================================
// GESTION DES CRÉNEAUX
// ================================
router.get('/timeslots', timeslotController.getAllTimeSlots);
router.post('/timeslots/generate', timeslotController.generateTimeSlots);
router.put('/timeslots/:id', timeslotController.updateTimeSlotAvailability);
router.delete('/timeslots/:id', timeslotController.deleteTimeSlot);
router.get('/timeslots/stats', timeslotController.getTimeSlotsStats);

// ================================
// GESTION DES RÉSERVATIONS
// ================================
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/stats', bookingController.getBookingStats);
router.put('/bookings/:id/status', bookingController.updateBookingStatus);

// Routes spécifiques admin pour les réservations
router.post('/bookings/create', async (req, res) => {
  // Création de réservation par l'admin (pour un client)
  try {
    const { clientId, serviceId, timeSlotId, notes, status = 'confirmed' } = req.body;
    
    // Validation
    if (!clientId || !serviceId || !timeSlotId) {
      return res.status(400).json({
        success: false,
        message: 'Client, service et créneau requis'
      });
    }
    
    // Utiliser la même logique que bookingController mais avec des permissions admin
    const { createBooking } = require('../controllers/bookingController');
    
    // Simuler une requête client
    req.client = { id: clientId };
    req.body = { serviceId, timeSlotId, clientNotes: notes };
    
    await createBooking(req, res);
    
    // Si succès, mettre à jour le statut si différent de 'pending'
    if (res.statusCode === 201 && status !== 'pending') {
      const booking = res.locals.booking; // Supposer que createBooking stocke la réservation
      if (booking) {
        await booking.update({ status });
      }
    }
  } catch (error) {
    console.error('Erreur création réservation admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  // Suppression/annulation de réservation par l'admin
  try {
    const { id } = req.params;
    const { reason = 'Annulé par l\'administrateur' } = req.body;
    
    const { Booking, TimeSlot } = require('../models');
    const { Op } = require('sequelize');
    
    const booking = await Booking.findByPk(id, {
      include: [{ model: TimeSlot, as: 'timeSlot' }]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }
    
    await booking.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledBy: 'admin',
      cancellationReason: reason
    });
    
    // Libérer le créneau
    if (booking.timeSlot) {
      await booking.timeSlot.update({
        currentBookings: Math.max(0, booking.timeSlot.currentBookings - 1)
      });
    }
    
    res.json({
      success: true,
      message: 'Réservation annulée avec succès',
      data: booking
    });
  } catch (error) {
    console.error('Erreur annulation réservation admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation',
      error: error.message
    });
  }
});

// ================================
// GESTION DES CONTACTS
// ================================
router.get('/contacts', contactController.getAllContacts);
router.get('/contacts/stats', contactController.getContactStats);
router.get('/contacts/:id', contactController.getContactById);
router.patch('/contacts/:id/read', contactController.markAsRead);
router.delete('/contacts/:id', contactController.deleteContact);

// ================================
// GESTION DES CLIENTS
// ================================
router.get('/clients', async (req, res) => {
  try {
    const { Client, Booking } = require('../models');
    const { Op } = require('sequelize');
    const { page = 1, limit = 20, search } = req.query;
    
    let whereConditions = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: clients } = await Client.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Booking,
          as: 'bookings',
          attributes: ['id', 'status', 'createdAt'],
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });
    
    res.json({
      success: true,
      message: 'Clients récupérés avec succès',
      data: clients,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération clients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clients',
      error: error.message
    });
  }
});

router.get('/clients/:id', async (req, res) => {
  try {
    const { Client, Booking, Service, TimeSlot } = require('../models');
    const { id } = req.params;
    
    const client = await Client.findByPk(id, {
      include: [
        {
          model: Booking,
          as: 'bookings',
          include: [
            { model: Service, as: 'service', attributes: ['name', 'price'] },
            { model: TimeSlot, as: 'timeSlot', attributes: ['date', 'startTime'] }
          ],
          order: [['createdAt', 'DESC']]
        }
      ]
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Client récupéré avec succès',
      data: client
    });
  } catch (error) {
    console.error('Erreur récupération client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du client',
      error: error.message
    });
  }
});

// ================================
// RAPPORTS ET EXPORTS
// ================================
router.get('/reports/bookings', async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    const { Booking, Client, Service, TimeSlot } = require('../models');
    const { Op } = require('sequelize');
    
    let whereConditions = {};
    
    if (startDate && endDate) {
      whereConditions.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    const bookings = await Booking.findAll({
      where: whereConditions,
      include: [
        { model: Client, as: 'client', attributes: ['firstName', 'lastName', 'email'] },
        { model: Service, as: 'service', attributes: ['name', 'category', 'price'] },
        { model: TimeSlot, as: 'timeSlot', attributes: ['date', 'startTime', 'endTime'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    if (format === 'csv') {
      // Générer un CSV
      const csv = [
        'Date Réservation,Client,Email,Service,Prix,Date RDV,Heure,Statut',
        ...bookings.map(booking => [
          booking.createdAt.toISOString().split('T')[0],
          `${booking.client.firstName} ${booking.client.lastName}`,
          booking.client.email,
          booking.service.name,
          booking.totalPrice,
          booking.timeSlot.date,
          booking.timeSlot.startTime,
          booking.status
        ].join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=reservations.csv');
      res.send(csv);
    } else {
      res.json({
        success: true,
        message: 'Rapport généré avec succès',
        data: bookings,
        summary: {
          totalBookings: bookings.length,
          totalRevenue: bookings.reduce((sum, b) => sum + parseFloat(b.totalPrice || 0), 0),
          byStatus: bookings.reduce((acc, b) => {
            acc[b.status] = (acc[b.status] || 0) + 1;
            return acc;
          }, {})
        }
      });
    }
  } catch (error) {
    console.error('Erreur génération rapport:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport',
      error: error.message
    });
  }
});

// ================================
// PARAMÈTRES SYSTÈME
// ================================
router.get('/settings', async (req, res) => {
  try {
    // Récupérer les paramètres système (à implémenter selon vos besoins)
    const settings = {
      businessHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '16:00', closed: false },
        sunday: { open: '00:00', close: '00:00', closed: true }
      },
      notifications: {
        emailConfirmation: true,
        emailReminder: true,
        reminderHours: 24
      },
      booking: {
        advanceBookingDays: 60,
        cancellationHours: 24,
        defaultSlotDuration: 90
      }
    };
    
    res.json({
      success: true,
      message: 'Paramètres récupérés avec succès',
      data: settings
    });
  } catch (error) {
    console.error('Erreur paramètres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paramètres',
      error: error.message
    });
  }
});

module.exports = router;