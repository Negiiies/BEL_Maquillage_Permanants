// backend/controllers/bookingController.js
const { Booking, Client, Service, TimeSlot, sequelize } = require('../models');
const { Op } = require('sequelize');

// Créer une réservation (CLIENT AUTHENTIFIÉ)
const createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const clientId = req.client.id; // Vient du middleware d'auth
    const { serviceId, timeSlotId, clientNotes } = req.body;
    
    // Validation
    if (!serviceId || !timeSlotId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Service et créneau horaire sont requis'
      });
    }
    
    // Vérifier que le service existe et est actif
    const service = await Service.findByPk(serviceId, { transaction });
    if (!service || !service.isActive) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé ou non disponible'
      });
    }
    
    // Vérifier que le créneau existe et est disponible
    const timeSlot = await TimeSlot.findByPk(timeSlotId, { transaction });
    if (!timeSlot || !timeSlot.isAvailable) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé ou non disponible'
      });
    }
    
    // Vérifier la capacité du créneau
    if (timeSlot.currentBookings >= timeSlot.maxBookings) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Ce créneau est complet'
      });
    }
    
    // Vérifier que le créneau est dans le futur
    const slotDateTime = new Date(`${timeSlot.date}T${timeSlot.startTime}`);
    if (slotDateTime <= new Date()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Impossible de réserver un créneau dans le passé'
      });
    }
    
    // Vérifier que le client n'a pas déjà une réservation à cette date/heure
    const existingBooking = await Booking.findOne({
      where: {
        clientId,
        timeSlotId,
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      transaction
    });
    
    if (existingBooking) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà une réservation pour ce créneau'
      });
    }
    
    // Calculer la durée par défaut selon le service
    let duration = 60; // par défaut
    if (service.category === 'maquillage_permanent') duration = 90;
    else if (service.category === 'extensions_cils') duration = 60;
    else if (service.category === 'soins_regard') duration = 30;
    
    // Créer la réservation
    const booking = await Booking.create({
      clientId,
      serviceId,
      timeSlotId,
      bookingDate: slotDateTime,
      duration,
      clientNotes: clientNotes ? clientNotes.trim() : null,
      totalPrice: service.price,
      status: 'pending'
    }, { transaction });
    
    // Mettre à jour le compteur de réservations du créneau
    await timeSlot.update({
      currentBookings: timeSlot.currentBookings + 1
    }, { transaction });
    
    await transaction.commit();
    
    // Récupérer la réservation complète avec les relations
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'category', 'description']
        },
        {
          model: TimeSlot,
          as: 'timeSlot',
          attributes: ['id', 'date', 'startTime', 'endTime']
        },
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès ! Nous vous confirmerons votre rendez-vous prochainement.',
      data: completeBooking
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur createBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la réservation',
      error: error.message
    });
  }
};

// Récupérer les réservations du client connecté
const getClientBookings = async (req, res) => {
  try {
    const clientId = req.client.id;
    const { status, upcoming, page = 1, limit = 10 } = req.query;
    
    let whereConditions = { clientId };
    
    // Filtrer par statut
    if (status) {
      whereConditions.status = status;
    }
    
    // Filtrer les réservations à venir
    if (upcoming === 'true') {
      whereConditions.bookingDate = {
        [Op.gte]: new Date()
      };
    }
    
    const offset = (page - 1) * limit;
    
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'category', 'description']
        },
        {
          model: TimeSlot,
          as: 'timeSlot',
          attributes: ['id', 'date', 'startTime', 'endTime']
        }
      ],
      order: [['bookingDate', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });
    
    res.json({
      success: true,
      message: 'Vos réservations récupérées avec succès',
      data: bookings,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erreur getClientBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations',
      error: error.message
    });
  }
};

// Ajoutez ceci à la fin de votre fichier bookingController.js

// Annuler une réservation (CLIENT)
const cancelBooking = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const clientId = req.client.id;
      const { cancellationReason } = req.body;
      
      // Trouver la réservation
      const booking = await Booking.findOne({
        where: {
          id,
          clientId,
          status: {
            [Op.notIn]: ['cancelled', 'completed']
          }
        },
        include: [
          {
            model: TimeSlot,
            as: 'timeSlot'
          },
          {
            model: Service,
            as: 'service',
            attributes: ['name']
          }
        ],
        transaction
      });
      
      if (!booking) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée ou déjà annulée'
        });
      }
      
      // Vérifier si l'annulation est possible (au moins 24h avant)
      const bookingTime = new Date(booking.bookingDate);
      const now = new Date();
      const hoursUntilBooking = (bookingTime - now) / (1000 * 60 * 60);
      
      if (hoursUntilBooking < 24) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Impossible d\'annuler moins de 24h avant le rendez-vous. Contactez-nous directement.',
          data: {
            hoursUntilBooking: Math.round(hoursUntilBooking * 10) / 10
          }
        });
      }
      
      // Mettre à jour la réservation
      await booking.update({
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: 'client',
        cancellationReason: cancellationReason || 'Annulé par le client'
      }, { transaction });
      
      // Libérer le créneau
      await booking.timeSlot.update({
        currentBookings: Math.max(0, booking.timeSlot.currentBookings - 1)
      }, { transaction });
      
      await transaction.commit();
      
      res.json({
        success: true,
        message: 'Réservation annulée avec succès',
        data: {
          id: booking.id,
          service: booking.service.name,
          date: booking.timeSlot.date,
          time: booking.timeSlot.startTime,
          cancelledAt: booking.cancelledAt
        }
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Erreur cancelBooking:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'annulation de la réservation',
        error: error.message
      });
    }
  };
  
  // Récupérer une réservation spécifique (CLIENT)
  const getBookingById = async (req, res) => {
    try {
      const { id } = req.params;
      const clientId = req.client.id;
      
      const booking = await Booking.findOne({
        where: {
          id,
          clientId
        },
        include: [
          {
            model: Service,
            as: 'service'
          },
          {
            model: TimeSlot,
            as: 'timeSlot'
          }
        ]
      });
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }
      
      res.json({
        success: true,
        message: 'Réservation récupérée avec succès',
        data: booking
      });
    } catch (error) {
      console.error('Erreur getBookingById:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la réservation',
        error: error.message
      });
    }
  };
  
  // ROUTES ADMIN
  
  // Récupérer toutes les réservations (ADMIN)
  const getAllBookings = async (req, res) => {
    try {
      const { status, date, serviceId, clientId, page = 1, limit = 20 } = req.query;
      
      let whereConditions = {};
      
      if (status) whereConditions.status = status;
      if (serviceId) whereConditions.serviceId = serviceId;
      if (clientId) whereConditions.clientId = clientId;
      
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        
        whereConditions.bookingDate = {
          [Op.between]: [startDate, endDate]
        };
      }
      
      const offset = (page - 1) * limit;
      
      const { count, rows: bookings } = await Booking.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: Client,
            as: 'client',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['id', 'name', 'price', 'category']
          },
          {
            model: TimeSlot,
            as: 'timeSlot',
            attributes: ['id', 'date', 'startTime', 'endTime']
          }
        ],
        order: [['bookingDate', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });
      
      res.json({
        success: true,
        message: 'Réservations récupérées avec succès',
        data: bookings,
        pagination: {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Erreur getAllBookings:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des réservations',
        error: error.message
      });
    }
  };
  
  // Mettre à jour le statut d'une réservation (ADMIN)
  const updateBookingStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Statut invalide',
          validStatuses
        });
      }
      
      const booking = await Booking.findByPk(id, {
        include: [
          {
            model: Client,
            as: 'client',
            attributes: ['firstName', 'lastName', 'email']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['name']
          }
        ]
      });
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }
      
      const oldStatus = booking.status;
      
      await booking.update({
        status,
        notes: notes || booking.notes,
        confirmationSent: status === 'confirmed' ? true : booking.confirmationSent
      });
      
      res.json({
        success: true,
        message: `Réservation ${status === 'confirmed' ? 'confirmée' : status === 'cancelled' ? 'annulée' : 'mise à jour'} avec succès`,
        data: {
          id: booking.id,
          oldStatus,
          newStatus: status,
          client: `${booking.client.firstName} ${booking.client.lastName}`,
          service: booking.service.name
        }
      });
    } catch (error) {
      console.error('Erreur updateBookingStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du statut',
        error: error.message
      });
    }
  };
  
  // Statistiques des réservations (ADMIN)
  const getBookingStats = async (req, res) => {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Statistiques générales
      const totalBookings = await Booking.count();
      const pendingBookings = await Booking.count({ where: { status: 'pending' } });
      const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } });
      const completedBookings = await Booking.count({ where: { status: 'completed' } });
      
      // Réservations du mois
      const monthlyBookings = await Booking.count({
        where: {
          createdAt: {
            [Op.gte]: startOfMonth
          }
        }
      });
      
      // Revenus du mois
      const monthlyRevenue = await Booking.sum('totalPrice', {
        where: {
          createdAt: {
            [Op.gte]: startOfMonth
          },
          status: {
            [Op.in]: ['confirmed', 'completed']
          }
        }
      });
      
      // Réservations par service
      const bookingsByService = await Booking.findAll({
        attributes: [
          'serviceId',
          [sequelize.fn('COUNT', sequelize.col('serviceId')), 'count']
        ],
        include: [{
          model: Service,
          as: 'service',
          attributes: ['name', 'category']
        }],
        where: {
          status: {
            [Op.in]: ['confirmed', 'completed']
          }
        },
        group: ['serviceId', 'service.id'],
        order: [[sequelize.literal('count'), 'DESC']],
        limit: 5
      });
      
      res.json({
        success: true,
        message: 'Statistiques récupérées avec succès',
        data: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          thisMonth: monthlyBookings,
          monthlyRevenue: monthlyRevenue || 0,
          popularServices: bookingsByService
        }
      });
    } catch (error) {
      console.error('Erreur getBookingStats:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  };
  
  // IMPORTANT: Les exports à la fin du fichier
  module.exports = {
    createBooking,
    getClientBookings,
    cancelBooking,
    getBookingById,
    getAllBookings,
    updateBookingStatus,
    getBookingStats
  };