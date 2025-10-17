// backend/controllers/serviceController.js - VERSION UNIFIÉE
const { Service, Booking, sequelize } = require('../models');
const { Op } = require('sequelize');

// ================================
// ROUTES PUBLIQUES
// ================================

// Récupérer toutes les prestations actives (PUBLIC)
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'description', 'price', 'duration', 'category'],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    res.json({
      success: true,
      message: 'Prestations récupérées avec succès',
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Erreur getAllServices:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des prestations',
      error: error.message
    });
  }
};

// Récupérer les prestations par catégorie (PUBLIC)
const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const validCategories = ['maquillage_permanent', 'extensions_cils', 'soins_regard', 'autres'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie invalide',
        validCategories: validCategories
      });
    }
    
    const services = await Service.findAll({
      where: { 
        category: category,
        isActive: true 
      },
      attributes: ['id', 'name', 'description', 'price', 'duration', 'category'],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });
    
    res.json({
      success: true,
      message: `Prestations ${category.replace('_', ' ')} récupérées avec succès`,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Erreur getServicesByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des prestations',
      error: error.message
    });
  }
};

// Récupérer une prestation par ID (PUBLIC)
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de prestation invalide'
      });
    }
    
    const service = await Service.findOne({
      where: { 
        id: id,
        isActive: true 
      },
      attributes: ['id', 'name', 'description', 'price', 'duration', 'category']
    });
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Prestation non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Prestation récupérée avec succès',
      data: service
    });
  } catch (error) {
    console.error('Erreur getServiceById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la prestation',
      error: error.message
    });
  }
};

// ================================
// ROUTES ADMIN (protégées)
// ================================

// Récupérer tous les services avec statistiques (ADMIN)
const getAllServicesAdmin = async (req, res) => {
  try {
    const { category, isActive, page = 1, limit = 20 } = req.query;
    
    let whereConditions = {};
    
    if (category) whereConditions.category = category;
    if (isActive !== undefined) whereConditions.isActive = isActive === 'true';
    
    const offset = (page - 1) * limit;
    
    const { count, rows: services } = await Service.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: { status: { [Op.in]: ['confirmed', 'completed'] } },
          required: false,
          attributes: []
        }
      ],
      attributes: [
        'id', 'name', 'description', 'price', 'duration', 'category', 
        'isActive', 'sortOrder', 'createdAt', 'updatedAt',
        [sequelize.fn('COUNT', sequelize.col('bookings.id')), 'totalBookings']
      ],
      group: ['Service.id'],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      limit: parseInt(limit),
      offset: offset,
      subQuery: false
    });
    
    res.json({
      success: true,
      message: 'Services récupérés avec succès',
      data: services,
      pagination: {
        totalItems: count.length || 0,
        totalPages: Math.ceil((count.length || 0) / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erreur getAllServicesAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des services',
      error: error.message
    });
  }
};

// Créer un nouveau service (ADMIN)
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category, sortOrder = 0 } = req.body;
    
    // Validation des champs requis
    if (!name || !price || !duration || !category) {
      return res.status(400).json({
        success: false,
        message: 'Nom, prix, durée et catégorie sont requis'
      });
    }
    
    // Validation de la durée
    if (duration < 15 || duration > 480) {
      return res.status(400).json({
        success: false,
        message: 'La durée doit être entre 15 minutes et 8 heures'
      });
    }
    
    // Validation du prix
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Le prix doit être supérieur à 0'
      });
    }
    
    // Validation de la catégorie
    const validCategories = ['maquillage_permanent', 'extensions_cils', 'soins_regard', 'autres'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie invalide',
        validCategories
      });
    }
    
    // Vérifier que le nom n'existe pas déjà
    const existingService = await Service.findOne({
      where: { 
        name: name.trim(),
        isActive: true 
      }
    });
    
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Un service avec ce nom existe déjà'
      });
    }
    
    const service = await Service.create({
      name: name.trim(),
      description: description ? description.trim() : null,
      price: parseFloat(price),
      duration: parseInt(duration),
      category,
      sortOrder: parseInt(sortOrder),
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Service créé avec succès',
      data: service
    });
  } catch (error) {
    console.error('Erreur createService:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du service',
      error: error.message
    });
  }
};

// Mettre à jour un service (ADMIN)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration, category, isActive, sortOrder } = req.body;
    
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    // Validation si fournie
    if (duration !== undefined && (duration < 15 || duration > 480)) {
      return res.status(400).json({
        success: false,
        message: 'La durée doit être entre 15 minutes et 8 heures'
      });
    }
    
    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Le prix doit être supérieur à 0'
      });
    }
    
    if (category !== undefined) {
      const validCategories = ['maquillage_permanent', 'extensions_cils', 'soins_regard', 'autres'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Catégorie invalide',
          validCategories
        });
      }
    }
    
    // Vérifier les réservations futures si on désactive le service
    if (isActive === false && service.isActive === true) {
      const futureBookings = await Booking.count({
        where: {
          serviceId: id,
          status: { [Op.in]: ['pending', 'confirmed'] },
          bookingDate: { [Op.gte]: new Date() }
        }
      });
      
      if (futureBookings > 0) {
        return res.status(400).json({
          success: false,
          message: `Impossible de désactiver ce service : ${futureBookings} réservation(s) future(s) existent`,
          data: { futureBookings }
        });
      }
    }
    
    await service.update({
      name: name ? name.trim() : service.name,
      description: description !== undefined ? (description ? description.trim() : null) : service.description,
      price: price !== undefined ? parseFloat(price) : service.price,
      duration: duration !== undefined ? parseInt(duration) : service.duration,
      category: category || service.category,
      isActive: isActive !== undefined ? isActive : service.isActive,
      sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : service.sortOrder
    });
    
    res.json({
      success: true,
      message: 'Service mis à jour avec succès',
      data: service
    });
  } catch (error) {
    console.error('Erreur updateService:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du service',
      error: error.message
    });
  }
};

// Supprimer un service (ADMIN)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service non trouvé'
      });
    }
    
    // Vérifier s'il y a des réservations liées
    const bookingsCount = await Booking.count({
      where: { serviceId: id }
    });
    
    if (bookingsCount > 0) {
      // Soft delete : désactiver au lieu de supprimer
      await service.update({ isActive: false });
      
      res.json({
        success: true,
        message: 'Service désactivé avec succès (des réservations existent)',
        data: {
          action: 'deactivated',
          relatedBookings: bookingsCount
        }
      });
    } else {
      // Hard delete : suppression complète
      await service.destroy();
      
      res.json({
        success: true,
        message: 'Service supprimé définitivement',
        data: {
          action: 'deleted'
        }
      });
    }
  } catch (error) {
    console.error('Erreur deleteService:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du service',
      error: error.message
    });
  }
};

// Réorganiser l'ordre des services (ADMIN)
const reorderServices = async (req, res) => {
  try {
    const { serviceOrders } = req.body;
    
    if (!Array.isArray(serviceOrders)) {
      return res.status(400).json({
        success: false,
        message: 'serviceOrders doit être un tableau'
      });
    }
    
    const promises = serviceOrders.map(({ id, sortOrder }) => 
      Service.update(
        { sortOrder: parseInt(sortOrder) },
        { where: { id: parseInt(id) } }
      )
    );
    
    await Promise.all(promises);
    
    res.json({
      success: true,
      message: 'Ordre des services mis à jour avec succès',
      data: {
        updatedServices: serviceOrders.length
      }
    });
  } catch (error) {
    console.error('Erreur reorderServices:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réorganisation des services',
      error: error.message
    });
  }
};

// Statistiques des services (ADMIN)
const getServicesStats = async (req, res) => {
  try {
    const totalServices = await Service.count();
    const activeServices = await Service.count({ where: { isActive: true } });
    const inactiveServices = totalServices - activeServices;
    
    // Services par catégorie
    const servicesByCategory = await Service.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { isActive: true },
      group: ['category'],
      raw: true
    });
    
    // Services les plus réservés
    const mostBookedServices = await Service.findAll({
      attributes: [
        'id', 'name', 'price', 'duration',
        [sequelize.fn('COUNT', sequelize.col('bookings.id')), 'bookingCount']
      ],
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: { status: { [Op.in]: ['confirmed', 'completed'] } },
          attributes: []
        }
      ],
      where: { isActive: true },
      group: ['Service.id'],
      order: [[sequelize.literal('bookingCount'), 'DESC']],
      limit: 5,
      subQuery: false
    });
    
    // Revenus par service (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const revenueByService = await Service.findAll({
      attributes: [
        'id', 'name',
        [sequelize.fn('SUM', sequelize.col('bookings.totalPrice')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('bookings.id')), 'bookings']
      ],
      include: [
        {
          model: Booking,
          as: 'bookings',
          where: {
            status: { [Op.in]: ['confirmed', 'completed'] },
            createdAt: { [Op.gte]: thirtyDaysAgo }
          },
          attributes: []
        }
      ],
      where: { isActive: true },
      group: ['Service.id'],
      order: [[sequelize.literal('revenue'), 'DESC']],
      limit: 5,
      subQuery: false
    });
    
    res.json({
      success: true,
      message: 'Statistiques des services récupérées',
      data: {
        overview: {
          total: totalServices,
          active: activeServices,
          inactive: inactiveServices
        },
        byCategory: servicesByCategory,
        mostBooked: mostBookedServices,
        topRevenue: revenueByService
      }
    });
  } catch (error) {
    console.error('Erreur getServicesStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

module.exports = {
  // Routes publiques
  getAllServices,
  getServicesByCategory,
  getServiceById,
  
  // Routes admin
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  reorderServices,
  getServicesStats
};