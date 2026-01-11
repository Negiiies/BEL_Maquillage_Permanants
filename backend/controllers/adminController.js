const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User, Service, Formation, Contact, BlacklistedToken, TwoFactorCode } = require('../models');
const { Op } = require('sequelize');
const { logAuthAttempt, logSecurityEvent } = require('../utils/securityLogger');

// Configuration email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ========================================
// CONNEXION ADMIN AVEC 2FA (ÉTAPE 1)
// ========================================
const loginAdminStep1 = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Chercher l'admin
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim(),
        role: 'admin',
        isActive: true 
      } 
    });

    if (!user) {
      logAuthAttempt(false, email, req.ip, 'admin');
      
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      logAuthAttempt(false, email, req.ip, 'admin');
      
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer un code 2FA à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiration : 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Supprimer les anciens codes non utilisés
    await TwoFactorCode.destroy({
      where: {
        userId: user.id,
        used: false
      }
    });

    // Créer le nouveau code
    await TwoFactorCode.create({
      userId: user.id,
      code,
      expiresAt,
      used: false
    });

    // Email HTML avec le code
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Code de Vérification</h1>
            <p>BEL Institut - Administration</p>
          </div>
          
          <div class="content">
            <p>Bonjour,</p>
            
            <p>Voici votre code de vérification pour accéder à l'administration :</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important :</strong><br>
              • Ce code expire dans <strong>10 minutes</strong><br>
              • Ne partagez jamais ce code avec personne<br>
              • Si vous n'avez pas demandé ce code, ignorez cet email
            </div>
            
            <p>Cordialement,<br><strong>Système de sécurité BEL Institut</strong></p>

            <div class="footer">
              <p>BEL Institut de Beauté - 59 route de la ferme du pavillon, 77600 Chanteloup-en-Brie</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email
    await transporter.sendMail({
      from: `"BEL Institut - Sécurité" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Code de vérification - Administration',
      html: emailHtml
    });

    logSecurityEvent('ADMIN_2FA_SENT', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Code de vérification envoyé par email',
      data: {
        requiresVerification: true,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erreur loginAdminStep1:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// ========================================
// VÉRIFICATION CODE 2FA (ÉTAPE 2)
// ========================================
const verifyTwoFactorCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email et code requis'
      });
    }

    // Chercher l'admin
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim(),
        role: 'admin',
        isActive: true 
      } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    // Chercher le code
    const twoFactorCode = await TwoFactorCode.findOne({
      where: {
        userId: user.id,
        code: code.trim(),
        used: false,
        expiresAt: {
          [Op.gt]: new Date() // Code non expiré
        }
      }
    });

    if (!twoFactorCode) {
      logSecurityEvent('ADMIN_2FA_FAILED', {
        userId: user.id,
        email: user.email,
        reason: 'Invalid or expired code',
        timestamp: new Date().toISOString()
      });

      return res.status(401).json({
        success: false,
        message: 'Code invalide ou expiré'
      });
    }

    // Marquer le code comme utilisé
    await twoFactorCode.update({ used: true });

    // Générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        type: 'admin'
      },
      process.env.JWT_SECRET || 'beauty_institute_secret_key_2025',
      { expiresIn: '8h' } // Session admin de 8h
    );

    // Mettre à jour la dernière connexion
    await user.update({ lastLoginAt: new Date() });

    logAuthAttempt(true, email, req.ip, 'admin');
    logSecurityEvent('ADMIN_2FA_SUCCESS', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });

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
    console.error('Erreur verifyTwoFactorCode:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du code'
    });
  }
};

// ========================================
// RENVOYER UN CODE 2FA
// ========================================
const resendTwoFactorCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    // Chercher l'admin
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim(),
        role: 'admin',
        isActive: true 
      } 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    // Vérifier qu'il n'y a pas eu de demande récente (anti-spam)
    const recentCode = await TwoFactorCode.findOne({
      where: {
        userId: user.id,
        createdAt: {
          [Op.gt]: new Date(Date.now() - 60 * 1000) // Moins d'1 minute
        }
      }
    });

    if (recentCode) {
      return res.status(429).json({
        success: false,
        message: 'Veuillez attendre 1 minute avant de demander un nouveau code'
      });
    }

    // Générer un nouveau code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Supprimer les anciens codes
    await TwoFactorCode.destroy({
      where: {
        userId: user.id,
        used: false
      }
    });

    // Créer le nouveau code
    await TwoFactorCode.create({
      userId: user.id,
      code,
      expiresAt,
      used: false
    });

    // Email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Nouveau Code de Vérification</h1>
            <p>BEL Institut - Administration</p>
          </div>
          
          <div class="content">
            <p>Bonjour,</p>
            
            <p>Voici votre nouveau code de vérification :</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important :</strong><br>
              • Ce code expire dans <strong>10 minutes</strong><br>
              • Les anciens codes sont désormais invalides
            </div>
            
            <p>Cordialement,<br><strong>Système de sécurité BEL Institut</strong></p>

            <div class="footer">
              <p>BEL Institut de Beauté</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email
    await transporter.sendMail({
      from: `"BEL Institut - Sécurité" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Nouveau code de vérification',
      html: emailHtml
    });

    logSecurityEvent('ADMIN_2FA_RESENT', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Nouveau code envoyé par email'
    });

  } catch (error) {
    console.error('Erreur resendTwoFactorCode:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du code'
    });
  }
};

// ========================================
// CRÉER UN COMPTE ADMIN (première installation)
// ========================================
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
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
    
    // Créer l'admin
    const admin = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    
    logSecurityEvent('ADMIN_CREATED', {
      userId: admin.id,
      email: admin.email,
      timestamp: new Date().toISOString()
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

// ========================================
// DASHBOARD - STATISTIQUES
// ========================================
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
          [Op.gte]: lastWeek
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

// ========================================
// VÉRIFIER LE TOKEN ADMIN
// ========================================
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

// ========================================
// DÉCONNEXION ADMIN
// ========================================
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
      expiresAt: new Date(decoded.exp * 1000),
      reason: 'logout'
    });

    logSecurityEvent('ADMIN_LOGOUT', {
      userId: decoded.userId,
      timestamp: new Date().toISOString()
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

// ========================================
// MIDDLEWARE AUTHENTIFICATION
// ========================================
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Token manquant'
      });
    }
    
    // Vérifier si le token est blacklisté
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

// ========================================
// EXPORTS
// ========================================
module.exports = {
  // 2FA
  loginAdminStep1,
  verifyTwoFactorCode,
  resendTwoFactorCode,
  // Admin classique
  createAdmin,
  getDashboardStats,
  verifyAdminToken,
  authMiddleware,
  logoutAdmin
};