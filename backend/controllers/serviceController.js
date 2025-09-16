const { Service } = require('../models');

// Récupérer toutes les prestations actives
const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
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

// Récupérer les prestations par catégorie
const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Valider la catégorie
    const validCategories = ['maquillage_permanent', 'extensions_cils', 'soins_regard'];
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
      order: [['createdAt', 'DESC']]
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

// Récupérer une prestation par ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Valider l'ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de prestation invalide'
      });
    }
    
    const service = await Service.findByPk(id);
    
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

// Créer une nouvelle prestation (admin)
const createService = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    // Validation des champs requis
    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Nom, description et catégorie sont requis'
      });
    }
    
    const service = await Service.create({
      name,
      description,
      price,
      category,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Prestation créée avec succès',
      data: service
    });
  } catch (error) {
    console.error('Erreur createService:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la prestation',
      error: error.message
    });
  }
};

// Mettre à jour une prestation (admin)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isActive } = req.body;
    
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Prestation non trouvée'
      });
    }
    
    await service.update({
      name: name || service.name,
      description: description || service.description,
      price: price || service.price,
      category: category || service.category,
      isActive: isActive !== undefined ? isActive : service.isActive
    });
    
    res.json({
      success: true,
      message: 'Prestation mise à jour avec succès',
      data: service
    });
  } catch (error) {
    console.error('Erreur updateService:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la prestation',
      error: error.message
    });
  }
};

// Supprimer une prestation (admin)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Prestation non trouvée'
      });
    }
    
    // Soft delete - on désactive au lieu de supprimer
    await service.update({ isActive: false });
    
    res.json({
      success: true,
      message: 'Prestation désactivée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteService:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la prestation',
      error: error.message
    });
  }
};

module.exports = {
  getAllServices,
  getServicesByCategory,
  getServiceById,
  createService,
  updateService,
  deleteService
};