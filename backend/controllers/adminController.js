const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User, Service, Formation, Contact, BlacklistedToken } = require('../models');

// Connexion admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }
    
    // Chercher l'utilisateur
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim(),
        isActive: true 
      } 
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }
    
    // Vérifier le mot de passe avec Argon2
    const isPasswordValid = await argon2.verify(user.password, password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }
    
    // Créer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'beauty_institute_secret_key_2025',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Erreur loginAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Créer un compte admin (première installation)
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }
    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }
    
    // Vérifier qu'aucun admin n'existe déjà
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Un compte administrateur existe déjà'
      });
    }
    
    // Hasher le mot de passe avec Argon2
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id, // Variante recommandée
      memoryCost: 2 ** 16,   // 64 MB
      timeCost: 3,           // 3 itérations
      parallelism: 1,        // 1 thread
    });
    
    // Créer l'admin
    const admin = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Compte administrateur créé avec succès',
      data: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erreur createAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte',
      error: error.message
    });
  }
};

// Dashboard - statistiques générales
const getDashboardStats = async (req, res) => {
  try {
    // Compter les éléments
    const totalServices = await Service.count({ where: { isActive: true } });
    const totalFormations = await Formation.count({ where: { isActive: true } });
    const totalContacts = await Contact.count();
    const unreadContacts = await Contact.count({ where: { isRead: false } });
    
    // Messages des 7 derniers jours
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentContacts = await Contact.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: lastWeek
        }
      }
    });
    
    res.json({
      success: true,
      message: 'Statistiques du dashboard récupérées',
      data: {
        services: {
          total: totalServices,
          active: totalServices
        },
        formations: {
          total: totalFormations,
          active: totalFormations
        },
        contacts: {
          total: totalContacts,
          unread: unreadContacts,
          recent: recentContacts
        }
      }
    });
  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// Vérifier le token admin
const verifyAdminToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beauty_institute_secret_key_2025');
    
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    res.json({
      success: true,
      message: 'Token valide',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Erreur verifyAdminToken:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide',
      error: error.message
    });
  }
};

// ✅ NOUVELLE FONCTION : Déconnexion admin avec révocation du token
const logoutAdmin = async (req, res) => {
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
      userId: decoded.userId,
      userType: 'admin',
      expiresAt: new Date(decoded.exp * 1000), // exp est en secondes, on convertit en ms
      reason: 'logout'
    });
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur logout admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la déconnexion',
      error: error.message
    });
  }
};

// ✅ MIDDLEWARE MODIFIÉ : Vérifier la blacklist
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Token manquant'
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
    
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive || user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur authMiddleware:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide',
      error: error.message
    });
  }
};

module.exports = {
  loginAdmin,
  createAdmin,
  getDashboardStats,
  verifyAdminToken,
  authMiddleware,
  logoutAdmin  // ✅ AJOUTÉ
};