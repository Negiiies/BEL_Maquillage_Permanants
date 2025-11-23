const { Formation } = require('../models');

// Récupérer toutes les formations actives
const getAllFormations = async (req, res) => {
  try {
    const formations = await Formation.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: 'Formations récupérées avec succès',
      data: formations,
      count: formations.length
    });
  } catch (error) {
    console.error('Erreur getAllFormations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: error.message
    });
  }
};

// ✅ NOUVELLE FONCTION : Récupérer les formations par catégorie
const getFormationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const validCategories = ['pigmentation', 'regard_sourcils'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie invalide',
        validCategories: validCategories
      });
    }
    
    const formations = await Formation.findAll({
      where: { 
        category: category,
        isActive: true 
      },
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: `Formations ${category} récupérées avec succès`,
      data: formations,
      count: formations.length
    });
  } catch (error) {
    console.error('Erreur getFormationsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: error.message
    });
  }
};

// Récupérer une formation par ID
const getFormationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de formation invalide'
      });
    }
    
    const formation = await Formation.findByPk(id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Formation récupérée avec succès',
      data: formation
    });
  } catch (error) {
    console.error('Erreur getFormationById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la formation',
      error: error.message
    });
  }
};

// Créer une nouvelle formation (admin)
const createFormation = async (req, res) => {
  try {
    const { title, description, price, duration, category, level, sortOrder } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Titre, description et catégorie sont requis'
      });
    }
    
    const validCategories = ['pigmentation', 'regard_sourcils'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie invalide',
        validCategories: validCategories
      });
    }
    
    const formation = await Formation.create({
      title,
      description,
      price,
      duration,
      category,
      level,
      sortOrder: sortOrder || 0,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Formation créée avec succès',
      data: formation
    });
  } catch (error) {
    console.error('Erreur createFormation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la formation',
      error: error.message
    });
  }
};

// Mettre à jour une formation (admin)
const updateFormation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, duration, category, level, sortOrder, isActive } = req.body;
    
    const formation = await Formation.findByPk(id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    if (category) {
      const validCategories = ['pigmentation', 'regard_sourcils'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Catégorie invalide',
          validCategories: validCategories
        });
      }
    }
    
    await formation.update({
      title: title || formation.title,
      description: description || formation.description,
      price: price !== undefined ? price : formation.price,
      duration: duration || formation.duration,
      category: category || formation.category,
      level: level || formation.level,
      sortOrder: sortOrder !== undefined ? sortOrder : formation.sortOrder,
      isActive: isActive !== undefined ? isActive : formation.isActive
    });
    
    res.json({
      success: true,
      message: 'Formation mise à jour avec succès',
      data: formation
    });
  } catch (error) {
    console.error('Erreur updateFormation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la formation',
      error: error.message
    });
  }
};

// Supprimer une formation (admin)
const deleteFormation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const formation = await Formation.findByPk(id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    await formation.update({ isActive: false });
    
    res.json({
      success: true,
      message: 'Formation désactivée avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteFormation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la formation',
      error: error.message
    });
  }
};

module.exports = {
  getAllFormations,
  getFormationsByCategory,  // ✅ NOUVELLE FONCTION
  getFormationById,
  createFormation,
  updateFormation,
  deleteFormation
};