// backend/controllers/timeslotController.js
const { TimeSlot, Service, Booking } = require('../models');
const { Op } = require('sequelize');

// Récupérer les créneaux disponibles (PUBLIC)
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, serviceId, startDate, endDate } = req.query;
    
    let whereConditions = {
      isAvailable: true,
      // Seulement les créneaux où il reste de la place
      currentBookings: {
        [Op.lt]: { [Op.col]: 'TimeSlot.maxBookings' }
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
    
    // Grouper par date pour une meilleure présentation
    const groupedSlots = timeSlots.reduce((acc, slot) => {
      const dateKey = slot.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(slot);
      return acc;
    }, {});
    
    res.json({
      success: true,
      message: 'Créneaux disponibles récupérés avec succès',
      data: {
        slots: timeSlots,
        groupedByDate: groupedSlots,
        totalSlots: timeSlots.length
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
          maxBookings: Math.max(1, Math.min(10, maxBookings)), // Entre 1 et 10
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
            status: {
              [Op.notIn]: ['cancelled']
            }
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
            status: {
              [Op.notIn]: ['cancelled']
            }
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
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']],
      limit: parseInt(limit),
      offset: offset
    });
    
    res.json({
      success: true,
      message: 'Créneaux récupérés avec succès',
      data: timeSlots,
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

module.exports = {
  getAvailableTimeSlots,
  createTimeSlots,
  updateTimeSlotAvailability,
  deleteTimeSlot,
  getAllTimeSlots
};