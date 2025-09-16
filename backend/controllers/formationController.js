const { Formation } = require('../models');

// Récupérer toutes les formations actives
const getAllFormations = async (req, res) => {
  try {
    const formations = await Formation.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
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

// Récupérer les formations par niveau
const getFormationsByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    
    // Valider le niveau
    const validLevels = ['debutant', 'intermediaire', 'avance'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Niveau invalide',
        validLevels: validLevels
      });
    }
    
    const formations = await Formation.findAll({
      where: { 
        level: level,
        isActive: true 
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: `Formations ${level} récupérées avec succès`,
      data: formations,
      count: formations.length
    });
  } catch (error) {
    console.error('Erreur getFormationsByLevel:', error);
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
    
    // Valider l'ID
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
    const { title, description, price, duration, level } = req.body;
    
    // Validation des champs requis
    if (!title || !description || !duration || !level) {
      return res.status(400).json({
        success: false,
        message: 'Titre, description, durée et niveau sont requis'
      });
    }
    
    // Valider le niveau
    const validLevels = ['debutant', 'intermediaire', 'avance'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Niveau invalide',
        validLevels: validLevels
      });
    }
    
    const formation = await Formation.create({
      title,
      description,
      price,
      duration,
      level,
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
    const { title, description, price, duration, level, isActive } = req.body;
    
    const formation = await Formation.findByPk(id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    // Valider le niveau si fourni
    if (level) {
      const validLevels = ['debutant', 'intermediaire', 'avance'];
      if (!validLevels.includes(level)) {
        return res.status(400).json({
          success: false,
          message: 'Niveau invalide',
          validLevels: validLevels
        });
      }
    }
    
    await formation.update({
      title: title || formation.title,
      description: description || formation.description,
      price: price || formation.price,
      duration: duration || formation.duration,
      level: level || formation.level,
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
    
    // Soft delete - on désactive au lieu de supprimer
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
  getFormationsByLevel,
  getFormationById,
  createFormation,
  updateFormation,
  deleteFormation
};