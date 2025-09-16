const { Contact } = require('../models');

// Envoyer un nouveau message de contact (public)
const sendContactMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    
    // Validation des champs requis
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Prénom, nom, email et message sont requis'
      });
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'email invalide'
      });
    }
    
    // Validation de la longueur du message
    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Le message doit contenir au moins 10 caractères'
      });
    }
    
    // Créer le message de contact
    const contact = await Contact.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
      isRead: false
    });
    
    res.status(201).json({
      success: true,
      message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
      data: {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur sendContactMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.',
      error: error.message
    });
  }
};

// Récupérer tous les messages de contact (admin)
const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;
    
    const offset = (page - 1) * limit;
    
    // Construire les conditions de filtrage
    const whereConditions = {};
    if (isRead !== undefined) {
      whereConditions.isRead = isRead === 'true';
    }
    
    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereConditions,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });
    
    res.json({
      success: true,
      message: 'Messages de contact récupérés avec succès',
      data: contacts,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erreur getAllContacts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages',
      error: error.message
    });
  }
};

// Récupérer un message de contact par ID (admin)
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de message invalide'
      });
    }
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Message récupéré avec succès',
      data: contact
    });
  } catch (error) {
    console.error('Erreur getContactById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du message',
      error: error.message
    });
  }
};

// Marquer un message comme lu/non lu (admin)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de message invalide'
      });
    }
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    await contact.update({
      isRead: isRead !== undefined ? isRead : true
    });
    
    res.json({
      success: true,
      message: `Message marqué comme ${contact.isRead ? 'lu' : 'non lu'}`,
      data: contact
    });
  } catch (error) {
    console.error('Erreur markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// Supprimer un message de contact (admin)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de message invalide'
      });
    }
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }
    
    await contact.destroy();
    
    res.json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteContact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du message',
      error: error.message
    });
  }
};

// Obtenir les statistiques des messages (admin)
const getContactStats = async (req, res) => {
  try {
    const totalMessages = await Contact.count();
    const unreadMessages = await Contact.count({ where: { isRead: false } });
    const todayMessages = await Contact.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });
    
    res.json({
      success: true,
      message: 'Statistiques récupérées avec succès',
      data: {
        totalMessages,
        unreadMessages,
        readMessages: totalMessages - unreadMessages,
        todayMessages
      }
    });
  } catch (error) {
    console.error('Erreur getContactStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

module.exports = {
  sendContactMessage,
  getAllContacts,
  getContactById,
  markAsRead,
  deleteContact,
  getContactStats
};