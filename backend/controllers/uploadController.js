const path = require('path');
const fs = require('fs');

// Upload d'une image de service
const uploadServiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier envoyé'
      });
    }

    // URL de l'image accessible publiquement
    const imageUrl = `/uploads/services/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      data: {
        imageUrl: imageUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Erreur upload image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
};

// Supprimer une image de service
const deleteServiceImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier manquant'
      });
    }

    const filePath = path.join(__dirname, '../public/uploads/services', filename);

    // Vérifier si le fichier existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      res.json({
        success: true,
        message: 'Image supprimée avec succès'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }
  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

// ⭐ NOUVEAU : Upload d'une image de formation
const uploadFormationImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier envoyé'
      });
    }

    // URL de l'image accessible publiquement
    const imageUrl = `/uploads/formations/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      data: {
        imageUrl: imageUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Erreur upload image formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error.message
    });
  }
};

// ⭐ NOUVEAU : Supprimer une image de formation
const deleteFormationImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier manquant'
      });
    }

    const filePath = path.join(__dirname, '../public/uploads/formations', filename);

    // Vérifier si le fichier existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      res.json({
        success: true,
        message: 'Image supprimée avec succès'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image non trouvée'
      });
    }
  } catch (error) {
    console.error('Erreur suppression image formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};

module.exports = {
  uploadServiceImage,
  deleteServiceImage,
  uploadFormationImage,     // ⭐ NOUVEAU
  deleteFormationImage      // ⭐ NOUVEAU
};