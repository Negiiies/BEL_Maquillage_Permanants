const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { Client, BlacklistedToken } = require('../models');

// Inscription client
const registerClient = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth } = req.body;
    
    // Validation des champs requis
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, mot de passe, prénom et nom sont requis'
      });
    }
    
    // Validation du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }
    
    // Vérifier si l'email existe déjà
    const existingClient = await Client.findOne({ 
      where: { email: email.toLowerCase().trim() } 
    });
    
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Un compte existe déjà avec cet email'
      });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await argon2.hash(password);
    
    // Générer un token de vérification email
    const emailVerificationToken = jwt.sign(
      { email: email.toLowerCase().trim() },
      process.env.JWT_SECRET || 'beauty_institute_secret_key_2025',
      { expiresIn: '24h' }
    );
    
    // Créer le client
    const client = await Client.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone ? phone.trim() : null,
      dateOfBirth: dateOfBirth || null,
      emailVerificationToken,
      isActive: true
    });
    
    // Créer le token JWT
    const token = jwt.sign(
      { 
        clientId: client.id, 
        email: client.email,
        type: 'client'
      },
      process.env.JWT_SECRET || 'beauty_institute_secret_key_2025',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès ! Bienvenue chez BEL Institut.',
      data: {
        token,
        client: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          emailVerified: client.emailVerified
        }
      }
    });
  } catch (error) {
    console.error('Erreur registerClient:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
      error: error.message
    });
  }
};

// Connexion client
const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }
    
    // Chercher le client
    const client = await Client.findOne({ 
      where: { 
        email: email.toLowerCase().trim(),
        isActive: true 
      } 
    });
    
    if (!client) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await argon2.verify(client.password, password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Mettre à jour la dernière connexion
    await client.update({ lastLoginAt: new Date() });
    
    // Créer le token JWT
    const token = jwt.sign(
      { 
        clientId: client.id, 
        email: client.email,
        type: 'client'
      },
      process.env.JWT_SECRET || 'beauty_institute_secret_key_2025',
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      message: `Bienvenue ${client.firstName} ! Connexion réussie.`,
      data: {
        token,
        client: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          emailVerified: client.emailVerified
        }
      }
    });
  } catch (error) {
    console.error('Erreur loginClient:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Vérifier le token client
const verifyClientToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beauty_institute_secret_key_2025');
    
    if (decoded.type !== 'client') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    const client = await Client.findByPk(decoded.clientId);
    
    if (!client || !client.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte introuvable ou désactivé'
      });
    }
    
    res.json({
      success: true,
      message: 'Token valide',
      data: {
        client: {
          id: client.id,
          email: client.email,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          emailVerified: client.emailVerified
        }
      }
    });
  } catch (error) {
    console.error('Erreur verifyClientToken:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
      error: error.message
    });
  }
};

// ✅ NOUVELLE FONCTION : Déconnexion client avec révocation du token
const logoutClient = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token manquant'
      });
    }
    
    // Décoder le token pour obtenir l'expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beauty_institute_secret_key_2025');
    
    // Ajouter à la blacklist
    await BlacklistedToken.create({
      token: token,
      userId: decoded.clientId,
      userType: 'client',
      expiresAt: new Date(decoded.exp * 1000),
      reason: 'logout'
    });
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur logout client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
      error: error.message
    });
  }
};

// ✅ MIDDLEWARE MODIFIÉ : Vérifier la blacklist
const clientAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Connexion requise'
      });
    }
    
    // ✅ VÉRIFIER SI LE TOKEN EST BLACKLISTÉ
    const isBlacklisted = await BlacklistedToken.findOne({
      where: { token: token }
    });
    
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token révoqué - Veuillez vous reconnecter'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beauty_institute_secret_key_2025');
    
    if (decoded.type !== 'client') {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }
    
    const client = await Client.findByPk(decoded.clientId);
    
    if (!client || !client.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte introuvable ou désactivé'
      });
    }
    
    req.client = client;
    next();
  } catch (error) {
    console.error('Erreur clientAuthMiddleware:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré',
      error: error.message
    });
  }
};

// Récupérer le profil client
const getClientProfile = async (req, res) => {
  try {
    const client = req.client; // Injecté par le middleware
    
    res.json({
      success: true,
      message: 'Profil récupéré avec succès',
      data: {
        id: client.id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        dateOfBirth: client.dateOfBirth,
        emailVerified: client.emailVerified,
        createdAt: client.createdAt
      }
    });
  } catch (error) {
    console.error('Erreur getClientProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// Mettre à jour le profil client
const updateClientProfile = async (req, res) => {
  try {
    const client = req.client;
    const { firstName, lastName, phone, dateOfBirth } = req.body;
    
    await client.update({
      firstName: firstName || client.firstName,
      lastName: lastName || client.lastName,
      phone: phone || client.phone,
      dateOfBirth: dateOfBirth || client.dateOfBirth
    });
    
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        id: client.id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        dateOfBirth: client.dateOfBirth
      }
    });
  } catch (error) {
    console.error('Erreur updateClientProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

module.exports = {
  registerClient,
  loginClient,
  verifyClientToken,
  clientAuthMiddleware,
  getClientProfile,
  updateClientProfile,
  logoutClient  // ✅ AJOUTÉ
};