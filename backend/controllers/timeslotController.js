// backend/controllers/timeslotController.js - VERSION COMPLÈTE AMÉLIORÉE
const { TimeSlot, Service, Booking, sequelize } = require('../models');
const { Op } = require('sequelize');

// Fonction helper pour calculer la durée selon le service
const getServiceDuration = (serviceCategory) => {
  switch (serviceCategory) {
    case 'maquillage_permanent': return 120; // 2h
    case 'extensions_cils': return 90;       // 1h30
    case 'soins_regard': return 30;          // 30min
    default: return 60;                      // 1h par défaut
  }
};

// Fonction helper pour vérifier si un créneau peut accueillir un service de durée donnée
const canSlotAccommodateService = async (slot, serviceDuration) => {
  const slotStart = new Date(`${slot.date}T${slot.startTime}`);
  const serviceEnd = new Date(slotStart.getTime() + (serviceDuration * 60000));
  
  // Vérifier s'il y a des réservations qui entreraient en conflit
  const conflictingBookings = await Booking.count({
    include: [{
      model: TimeSlot,
      as: 'timeSlot',
      where: { 
        date: slot.date,
        [Op.or]: [
          // Créneaux qui commencent pendant notre service
          {
            startTime: {
              [Op.between]: [
                slot.startTime,
                serviceEnd.toTimeString().slice(0, 5)
              ]
            }
          },
          // Créneaux qui se terminent pendant notre service
          {
            [Op.and]: [
              { startTime: { [Op.lt]: slot.startTime } },
              { endTime: { [Op.gt]: slot.startTime } }
            ]
          }
        ]
      }
    }],
    where: {
      status: { [Op.notIn]: ['cancelled'] },
      [Op.or]: [
        // Réservations existantes qui chevaucheraient
        {
          bookingDate: {
            [Op.between]: [slotStart, serviceEnd]
          }
        },
        // Réservations qui commencent avant et finissent pendant notre créneau
        {
          [Op.and]: [
            { bookingDate: { [Op.lt]: slotStart } },
            sequelize.literal(`DATE_ADD(bookingDate, INTERVAL duration MINUTE) > '${slotStart.toISOString()}'`)
          ]
        }
      ]
    }
  });
  
  return conflictingBookings === 0;
};

// Récupérer les créneaux disponibles (PUBLIC)
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, serviceId, startDate, endDate } = req.query;
    
    // Déterminer la durée du service
    let serviceDuration = 60; // Par défaut
    let service = null;
    
    if (serviceId) {
      service = await Service.findByPk(serviceId);
      if (service) {
        serviceDuration = getServiceDuration(service.category);
      }
    }
    
    let whereConditions = {
      isAvailable: true,
      currentBookings: {
        [Op.lt]: sequelize.col('TimeSlot.maxBookings')
      }
    };
    
    // Filtrer par date
    if (date) {
      whereConditions.date = date;
    } else if (startDate && endDate) {
      whereConditions.date = {
        [Op.between]: [startDate, endDate]
      };
    } else {
      // Par défaut, les 30 prochains jours
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 30);
      
      whereConditions.date = {
        [Op.between]: [
          today.toISOString().split('T')[0], 
          futureDate.toISOString().split('T')[0]
        ]
      };
    }
    
    // Filtrer par service si spécifié
    if (serviceId) {
      whereConditions[Op.or] = [
        { serviceId: serviceId },
        { serviceId: null } // Créneaux disponibles pour tous les services
      ];
    }
    
    const timeSlots = await TimeSlot.findAll({
      where: whereConditions,
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'category', 'description']
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });
    
    // ✅ FILTRAGE INTELLIGENT : Vérifier que chaque créneau peut vraiment accueillir le service
    const availableSlots = [];
    
    for (const slot of timeSlots) {
      const canAccommodate = await canSlotAccommodateService(slot, serviceDuration);
      
      if (canAccommodate) {
        const slotStart = new Date(`${slot.date}T${slot.startTime}`);
        const serviceEnd = new Date(slotStart.getTime() + (serviceDuration * 60000));
        
        availableSlots.push({
          ...slot.toJSON(),
          estimatedEndTime: serviceEnd.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          serviceDuration,
          serviceDetails: service ? {
            name: service.name,
            category: service.category,
            price: service.price
          } : null
        });
      }
    }
    
    // Grouper par date pour une meilleure présentation
    const groupedSlots = availableSlots.reduce((acc, slot) => {
      const dateKey = slot.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(slot);
      return acc;
    }, {});
    
    res.json({
      success: true,
      message: `Créneaux disponibles pour un service de ${serviceDuration} minutes`,
      data: {
        slots: availableSlots,
        groupedByDate: groupedSlots,
        totalSlots: availableSlots.length,
        serviceDuration,
        serviceInfo: service ? {
          id: service.id,
          name: service.name,
          category: service.category,
          duration: serviceDuration
        } : null
      }
    });
  } catch (error) {
    console.error('Erreur getAvailableTimeSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des créneaux',
      error: error.message
    });
  }
};

// Créer des créneaux (ADMIN)
const createTimeSlots = async (req, res) => {
  try {
    const { date, slots, serviceId } = req.body;
    
    // Validation
    if (!date || !slots || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: 'Date et créneaux requis (slots doit être un tableau)'
      });
    }
    
    // Validation de la date
    const slotDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (slotDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de créer des créneaux dans le passé'
      });
    }
    
    const createdSlots = [];
    const errors = [];
    
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const { startTime, endTime, maxBookings = 1 } = slot;
      
      // Validation du créneau
      if (!startTime || !endTime) {
        errors.push(`Créneau ${i + 1}: Heure de début et fin requises`);
        continue;
      }
      
      if (startTime >= endTime) {
        errors.push(`Créneau ${i + 1}: L'heure de fin doit être après l'heure de début`);
        continue;
      }
      
      // Vérifier si le créneau existe déjà
      const existingSlot = await TimeSlot.findOne({
        where: {
          date,
          startTime,
          endTime,
          serviceId: serviceId || null
        }
      });
      
      if (existingSlot) {
        errors.push(`Créneau ${i + 1}: Ce créneau existe déjà`);
        continue;
      }
      
      try {
        const timeSlot = await TimeSlot.create({
          date,
          startTime,
          endTime,
          serviceId: serviceId || null,
          maxBookings: Math.max(1, Math.min(10, maxBookings)),
          isAvailable: true,
          currentBookings: 0
        });
        createdSlots.push(timeSlot);
      } catch (createError) {
        errors.push(`Créneau ${i + 1}: ${createError.message}`);
      }
    }
    
    res.status(createdSlots.length > 0 ? 201 : 400).json({
      success: createdSlots.length > 0,
      message: `${createdSlots.length} créneaux créés avec succès`,
      data: {
        created: createdSlots,
        errors: errors
      }
    });
  } catch (error) {
    console.error('Erreur createTimeSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création des créneaux',
      error: error.message
    });
  }
};

// Créer des créneaux automatiquement pour une période (ADMIN)
const generateTimeSlots = async (req, res) => {
  try {
    const { startDate, endDate, weekDays = [1, 2, 3, 4, 5, 6] } = req.body; // 1=lundi, 6=samedi
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Date de début et fin requises'
      });
    }
    
    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Horaires par défaut
    const defaultSchedule = {
      weekdays: [ // Lundi à Vendredi
        { start: '09:00', end: '10:30' },
        { start: '10:30', end: '12:00' },
        { start: '14:00', end: '15:30' },
        { start: '15:30', end: '17:00' },
        { start: '17:00', end: '18:30' }
      ],
      saturday: [ // Samedi
        { start: '09:00', end: '10:30' },
        { start: '10:30', end: '12:00' },
        { start: '14:00', end: '15:30' },
        { start: '15:30', end: '17:00' }
      ]
    };
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay(); // 0=dimanche, 1=lundi, etc.
      
      // Ignorer les dimanches et les jours non sélectionnés
      if (dayOfWeek === 0 || !weekDays.includes(dayOfWeek)) continue;
      
      const dateString = date.toISOString().split('T')[0];
      const schedule = dayOfWeek === 6 ? defaultSchedule.saturday : defaultSchedule.weekdays;
      
      for (const timeSlot of schedule) {
        // Vérifier si le créneau existe déjà
        const existing = await TimeSlot.findOne({
          where: {
            date: dateString,
            startTime: timeSlot.start,
            endTime: timeSlot.end
          }
        });
        
        if (!existing) {
          slots.push({
            date: dateString,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            isAvailable: true,
            maxBookings: 1,
            currentBookings: 0
          });
        }
      }
    }
    
    if (slots.length > 0) {
      await TimeSlot.bulkCreate(slots);
    }
    
    res.json({
      success: true,
      message: `${slots.length} créneaux générés avec succès`,
      data: {
        period: `${startDate} à ${endDate}`,
        slotsCreated: slots.length,
        weekDaysIncluded: weekDays
      }
    });
    
  } catch (error) {
    console.error('Erreur generateTimeSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération des créneaux',
      error: error.message
    });
  }
};

// Mettre à jour la disponibilité d'un créneau (ADMIN)
const updateTimeSlotAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;
    
    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isAvailable doit être true ou false'
      });
    }
    
    const timeSlot = await TimeSlot.findByPk(id, {
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: {
            status: { [Op.notIn]: ['cancelled'] }
          },
          required: false
        }
      ]
    });
    
    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // Vérifier s'il y a des réservations actives avant de désactiver
    if (!isAvailable && timeSlot.bookings && timeSlot.bookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de désactiver un créneau avec des réservations actives',
        data: {
          activeBookings: timeSlot.bookings.length
        }
      });
    }
    
    await timeSlot.update({ isAvailable });
    
    res.json({
      success: true,
      message: `Créneau ${isAvailable ? 'activé' : 'désactivé'} avec succès`,
      data: timeSlot
    });
  } catch (error) {
    console.error('Erreur updateTimeSlotAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du créneau',
      error: error.message
    });
  }
};

// Supprimer un créneau (ADMIN)
const deleteTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    
    const timeSlot = await TimeSlot.findByPk(id, {
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: {
            status: { [Op.notIn]: ['cancelled'] }
          },
          required: false
        }
      ]
    });
    
    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }
    
    // Vérifier s'il y a des réservations actives
    if (timeSlot.bookings && timeSlot.bookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer un créneau avec des réservations actives',
        data: {
          activeBookings: timeSlot.bookings.length
        }
      });
    }
    
    await timeSlot.destroy();
    
    res.json({
      success: true,
      message: 'Créneau supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteTimeSlot:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du créneau',
      error: error.message
    });
  }
};

// Récupérer tous les créneaux (ADMIN)
const getAllTimeSlots = async (req, res) => {
  try {
    const { date, isAvailable, serviceId, page = 1, limit = 50 } = req.query;
    
    let whereConditions = {};
    
    if (date) whereConditions.date = date;
    if (isAvailable !== undefined) whereConditions.isAvailable = isAvailable === 'true';
    if (serviceId) whereConditions.serviceId = serviceId;
    
    const offset = (page - 1) * limit;
    
    const { count, rows: timeSlots } = await TimeSlot.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'category']
        },
        {
          model: Booking,
          as: 'bookings',
          where: { status: { [Op.notIn]: ['cancelled'] } },
          required: false,
          include: [
            {
              model: Client,
              as: 'client',
              attributes: ['firstName', 'lastName']
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });
    
    // Enrichir les données avec des informations utiles
    const enrichedSlots = timeSlots.map(slot => {
      const slotData = slot.toJSON();
      return {
        ...slotData,
        occupancyRate: slot.maxBookings > 0 ? (slot.currentBookings / slot.maxBookings) * 100 : 0,
        isFull: slot.currentBookings >= slot.maxBookings,
        bookingsDetails: slotData.bookings?.map(booking => ({
          id: booking.id,
          clientName: `${booking.client.firstName} ${booking.client.lastName}`,
          duration: booking.duration,
          status: booking.status
        })) || []
      };
    });
    
    res.json({
      success: true,
      message: 'Créneaux récupérés avec succès',
      data: enrichedSlots,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erreur getAllTimeSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des créneaux',
      error: error.message
    });
  }
};

// Obtenir les statistiques des créneaux (ADMIN)
const getTimeSlotsStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const totalSlots = await TimeSlot.count();
    const availableSlots = await TimeSlot.count({ 
      where: { 
        isAvailable: true,
        date: { [Op.gte]: today }
      } 
    });
    const fullyBookedSlots = await TimeSlot.count({
      where: {
        currentBookings: { [Op.gte]: sequelize.col('maxBookings') },
        date: { [Op.gte]: today }
      }
    });
    
    // Créneaux les plus demandés
    const popularSlots = await TimeSlot.findAll({
      attributes: [
        'startTime',
        [sequelize.fn('COUNT', sequelize.col('bookings.id')), 'bookingCount'],
        [sequelize.fn('AVG', sequelize.col('currentBookings')), 'avgOccupancy']
      ],
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: { status: { [Op.in]: ['confirmed', 'completed'] } },
          attributes: []
        }
      ],
      group: ['TimeSlot.startTime'],
      order: [[sequelize.literal('bookingCount'), 'DESC']],
      limit: 5
    });
    
    res.json({
      success: true,
      message: 'Statistiques des créneaux récupérées',
      data: {
        total: totalSlots,
        available: availableSlots,
        fullyBooked: fullyBookedSlots,
        occupancyRate: totalSlots > 0 ? ((totalSlots - availableSlots) / totalSlots * 100).toFixed(1) : 0,
        popularTimeSlots: popularSlots
      }
    });
  } catch (error) {
    console.error('Erreur getTimeSlotsStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

module.exports = {
  getAvailableTimeSlots,
  createTimeSlots,
  generateTimeSlots,
  updateTimeSlotAvailability,
  deleteTimeSlot,
  getAllTimeSlots,
  getTimeSlotsStats
};