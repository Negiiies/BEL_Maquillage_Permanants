// backend/controllers/timeslotController.js - VERSION PLANITY CORRIGÉE
const { TimeSlot, Service, Booking, Client, sequelize } = require('../models');
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

// ✅ NOUVELLE LOGIQUE PLANITY : Vérifier si le créneau + les créneaux consécutifs peuvent accueillir le service
const canSlotAccommodateService = async (slot, serviceDuration) => {
  const slotStart = new Date(`${slot.date}T${slot.startTime}`);
  const slotEnd = new Date(`${slot.date}T${slot.endTime}`);
  const serviceEnd = new Date(slotStart.getTime() + (serviceDuration * 60000));
  
  console.log(`   📏 Créneau: ${slot.startTime}-${slot.endTime}`);
  console.log(`   ⏱️  Service: ${serviceDuration} min (fin prévue: ${serviceEnd.toTimeString().slice(0, 5)})`);
  
  // Calculer la durée du créneau en minutes
  const slotDurationMinutes = (slotEnd - slotStart) / 60000;
  
  // Si le service tient dans ce seul créneau
  if (serviceDuration <= slotDurationMinutes) {
    console.log(`   ✅ Service tient dans le créneau unique`);
    
    // Vérifier qu'il n'y a pas de réservation sur ce créneau
    const conflictingBookings = await Booking.count({
      where: {
        timeSlotId: slot.id,
        status: { [Op.notIn]: ['cancelled'] }
      }
    });
    
    if (conflictingBookings > 0) {
      console.log(`   ❌ Rejeté: Créneau déjà réservé`);
      return false;
    }
    
    console.log(`   ✅ Créneau OK`);
    return true;
  }
  
  // Si le service nécessite plusieurs créneaux consécutifs
  console.log(`   🔄 Service nécessite plusieurs créneaux consécutifs`);
  
  // ⭐ CORRECTION : Convertir serviceEnd en string HH:MM:SS
  const serviceEndTimeString = `${String(serviceEnd.getHours()).padStart(2, '0')}:${String(serviceEnd.getMinutes()).padStart(2, '0')}:00`;
  
  console.log(`   🔍 Recherche créneaux de ${slot.startTime} jusqu'à ${serviceEndTimeString}`);
  
  // Récupérer tous les créneaux du même jour à partir de ce créneau
  const allSlotsOfDay = await TimeSlot.findAll({
    where: {
      date: slot.date,
      startTime: { 
        [Op.gte]: slot.startTime,
        [Op.lt]: serviceEndTimeString  // ✅ Maintenant c'est une string
      }
    },
    include: [{
      model: Booking,
      as: 'bookings',
      where: { status: { [Op.notIn]: ['cancelled'] } },
      required: false
    }],
    order: [['startTime', 'ASC']]
  });
  
  console.log(`   📊 ${allSlotsOfDay.length} créneaux à vérifier jusqu'à ${serviceEndTimeString}`);
  
  // Vérifier que les créneaux sont consécutifs et disponibles
  let currentTime = new Date(`${slot.date}T${slot.startTime}`);
  let totalCoveredDuration = 0;
  
  for (const timeSlot of allSlotsOfDay) {
    const tsStart = new Date(`${timeSlot.date}T${timeSlot.startTime}`);
    const tsEnd = new Date(`${timeSlot.date}T${timeSlot.endTime}`);
    
    // Vérifier que le créneau est disponible
    if (!timeSlot.isAvailable) {
      console.log(`   ❌ Créneau ${timeSlot.startTime}-${timeSlot.endTime} indisponible`);
      return false;
    }
    
    // Vérifier qu'il n'y a pas de réservation
    if (timeSlot.bookings && timeSlot.bookings.length > 0) {
      console.log(`   ❌ Créneau ${timeSlot.startTime}-${timeSlot.endTime} déjà réservé`);
      return false;
    }
    
    // Vérifier que le créneau est bien consécutif
    if (tsStart.getTime() !== currentTime.getTime()) {
      console.log(`   ❌ Trou dans les créneaux (attendu: ${currentTime.toTimeString().slice(0, 5)}, trouvé: ${timeSlot.startTime})`);
      return false;
    }
    
    totalCoveredDuration += (tsEnd - tsStart) / 60000;
    currentTime = tsEnd;
    
    console.log(`   ✓ Créneau ${timeSlot.startTime}-${timeSlot.endTime} libre (total couvert: ${totalCoveredDuration}min)`);
    
    // Si on a assez de durée, c'est bon
    if (totalCoveredDuration >= serviceDuration) {
      console.log(`   ✅ Tous les créneaux nécessaires sont disponibles !`);
      return true;
    }
  }
  
  console.log(`   ❌ Rejeté: Pas assez de créneaux consécutifs (${totalCoveredDuration}min < ${serviceDuration}min)`);
  return false;
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
        serviceDuration = service.duration || 60;
      }
    }
    
    console.log('\n🔍 ===== RECHERCHE CRÉNEAUX =====');
    console.log('🔍 Service:', service?.name || 'Aucun');
    console.log('🔍 Durée requise:', serviceDuration, 'minutes');
    
    let whereConditions = {
      isAvailable: true,
      currentBookings: {
        [Op.lt]: sequelize.col('TimeSlot.maxBookings')
      }
    };
    
    // Filtrer par date
    if (date) {
      whereConditions.date = date;
      console.log('🔍 Date filtrée:', date);
    } else if (startDate && endDate) {
      whereConditions.date = {
        [Op.between]: [startDate, endDate]
      };
      console.log('🔍 Période:', startDate, 'à', endDate);
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
      console.log('🔍 Période par défaut: 30 prochains jours');
    }
    
    // Filtrer par service si spécifié
    if (serviceId) {
      whereConditions[Op.or] = [
        { serviceId: serviceId },
        { serviceId: null }
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
    
    console.log(`\n📊 ${timeSlots.length} créneaux trouvés dans la DB`);
    
    // ✅ FILTRAGE INTELLIGENT : Vérifier que chaque créneau peut vraiment accueillir le service
    const availableSlots = [];
    
    for (const slot of timeSlots) {
      console.log(`\n🔎 Vérification créneau #${slot.id}: ${slot.date} ${slot.startTime}-${slot.endTime}`);
      
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
    
    console.log(`\n✅ RÉSULTAT FINAL: ${availableSlots.length} créneaux disponibles`);
    console.log('================================\n');
    
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
    console.error('❌ Erreur getAvailableTimeSlots:', error);
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
    const { startDate, endDate, weekDays = [1, 2, 3, 4, 5, 6] } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Date de début et fin requises'
      });
    }
    
    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const defaultSchedule = {
      weekdays: [
        { start: '09:00', end: '10:30' },
        { start: '10:30', end: '12:00' },
        { start: '14:00', end: '15:30' },
        { start: '15:30', end: '17:00' },
        { start: '17:00', end: '18:30' }
      ],
      saturday: [
        { start: '09:00', end: '10:30' },
        { start: '10:30', end: '12:00' },
        { start: '14:00', end: '15:30' },
        { start: '15:30', end: '17:00' }
      ]
    };
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0 || !weekDays.includes(dayOfWeek)) continue;
      
      const dateString = date.toISOString().split('T')[0];
      const schedule = dayOfWeek === 6 ? defaultSchedule.saturday : defaultSchedule.weekdays;
      
      for (const timeSlot of schedule) {
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
      message: 'Erreur lors de la mise à jour',
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
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

// Récupérer tous les créneaux (ADMIN)
const getAllTimeSlots = async (req, res) => {
  try {
    const { date, startDate, endDate, isAvailable } = req.query;
    
    let whereConditions = {};
    
    if (date) {
      whereConditions.date = date;
    } else if (startDate && endDate) {
      whereConditions.date = {
        [Op.between]: [startDate, endDate]
      };
    }
    
    if (isAvailable !== undefined) {
      whereConditions.isAvailable = isAvailable === 'true';
    }
    
    const timeSlots = await TimeSlot.findAll({
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
          where: {
            status: { [Op.notIn]: ['cancelled'] }
          },
          required: false,
          include: [
            {
              model: Client,
              as: 'client',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });
    
    res.json({
      success: true,
      data: timeSlots,
      total: timeSlots.length
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

// Statistiques des créneaux (ADMIN)
const getTimeSlotsStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [total, available, booked, past] = await Promise.all([
      TimeSlot.count(),
      TimeSlot.count({ where: { isAvailable: true } }),
      TimeSlot.count({
        where: {
          currentBookings: {
            [Op.gt]: 0
          }
        }
      }),
      TimeSlot.count({
        where: {
          date: {
            [Op.lt]: today.toISOString().split('T')[0]
          }
        }
      })
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        available,
        booked,
        past,
        upcoming: total - past
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