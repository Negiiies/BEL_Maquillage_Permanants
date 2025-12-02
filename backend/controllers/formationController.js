const { Formation } = require('../models');

// Récupérer toutes les formations
exports.getAllFormations = async (req, res) => {
  try {
    const formations = await Formation.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: formations
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

// Récupérer les formations par catégorie (ancien système)
exports.getFormationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['pigmentation', 'regard_sourcils'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie invalide. Utilisez: pigmentation ou regard_sourcils'
      });
    }

    const formations = await Formation.findAll({
      where: { 
        category,
        isActive: true 
      },
      order: [['sortOrder', 'ASC']]
    });

    res.json({
      success: true,
      data: formations
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

// 🆕 Récupérer les formations par sous-catégorie (nouveau système)
exports.getFormationsBySubcategory = async (req, res) => {
  try {
    const { subcategory } = req.params;
    const validSubcategories = ['cils', 'levres', 'sourcils'];

    if (!validSubcategories.includes(subcategory)) {
      return res.status(400).json({
        success: false,
        message: 'Sous-catégorie invalide. Utilisez: cils, levres ou sourcils'
      });
    }

    const formations = await Formation.findAll({
      where: { 
        subcategory,
        isActive: true 
      },
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: formations,
      count: formations.length
    });
  } catch (error) {
    console.error('Erreur getFormationsBySubcategory:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: error.message
    });
  }
};

// Récupérer une formation par ID
exports.getFormationById = async (req, res) => {
  try {
    const { id } = req.params;

    const formation = await Formation.findByPk(id);

    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }

    res.json({
      success: true,
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

// Créer une formation (ADMIN)
exports.createFormation = async (req, res) => {
  try {
    const { title, description, price, duration, category, subcategory, level, imageUrl } = req.body;

    // Validation
    if (!title || !description || !price || !duration || !category || !subcategory || !level) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Créer la formation
    const formation = await Formation.create({
      title,
      description,
      price,
      duration,
      category,
      subcategory,
      level,
      imageUrl,
      isActive: true,
      sortOrder: 0
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

// Mettre à jour une formation (ADMIN)
exports.updateFormation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, duration, category, subcategory, level, imageUrl, isActive, sortOrder } = req.body;

    const formation = await Formation.findByPk(id);

    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }

    // Mettre à jour
    await formation.update({
      title: title || formation.title,
      description: description || formation.description,
      price: price !== undefined ? price : formation.price,
      duration: duration || formation.duration,
      category: category || formation.category,
      subcategory: subcategory || formation.subcategory,
      level: level || formation.level,
      imageUrl: imageUrl !== undefined ? imageUrl : formation.imageUrl,
      isActive: isActive !== undefined ? isActive : formation.isActive,
      sortOrder: sortOrder !== undefined ? sortOrder : formation.sortOrder
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

// Supprimer une formation (ADMIN)
exports.deleteFormation = async (req, res) => {
  try {
    const { id } = req.params;

    const formation = await Formation.findByPk(id);

    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }

    await formation.destroy();

    res.json({
      success: true,
      message: 'Formation supprimée avec succès'
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