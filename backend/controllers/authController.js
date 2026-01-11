const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { Client, BlacklistedToken, Booking, sequelize, PasswordResetToken } = require('../models');
const { Op } = require('sequelize');
const { logAuthAttempt, logSecurityEvent } = require('../utils/securityLogger');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ========================================
// INSCRIPTION & CONNEXION
// ========================================

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
      logAuthAttempt(false, email, req.ip, 'client');
      
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await argon2.verify(client.password, password);
    
    if (!isPasswordValid) {
      logAuthAttempt(false, email, req.ip, 'client');
      
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    logAuthAttempt(true, email, req.ip, 'client');
    
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
        message: 'Connexion requise'
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
    
    res.json({
      success: true,
      message: 'Session valide',
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
      message: 'Session expirée, veuillez vous reconnecter',
      error: error.message
    });
  }
};

// Déconnexion client avec révocation du token
const logoutClient = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Aucune session active'
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

// ========================================
// MOT DE PASSE OUBLIÉ / RÉINITIALISATION
// ========================================

// Demande de réinitialisation (Mot de passe oublié)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez indiquer votre adresse email'
      });
    }

    // Vérifier si le client existe
    const client = await Client.findOne({ where: { email: email.toLowerCase() } });

    // ⚠️ IMPORTANT : Toujours retourner le même message pour éviter l'énumération d'emails
    if (!client) {
      return res.status(200).json({
        success: true,
        message: 'Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.'
      });
    }

    // Générer un token sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Expiration : 1 heure
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Supprimer les anciens tokens non utilisés de ce client
    await PasswordResetToken.destroy({
      where: {
        clientId: client.id,
        used: false
      }
    });

    // Créer le nouveau token
    await PasswordResetToken.create({
      clientId: client.id,
      token: hashedToken,
      expiresAt,
      used: false
    });

    // URL de réinitialisation
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password/${resetToken}`;

    // Email de réinitialisation
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Réinitialisation de mot de passe</h1>
            <p>BEL Institut de Beauté</p>
          </div>
          
          <div class="content">
            <p>Bonjour ${client.firstName},</p>
            
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            
            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important :</strong><br>
              • Ce lien expire dans <strong>1 heure</strong><br>
              • Si vous n'avez pas fait cette demande, ignorez cet email<br>
              • Votre mot de passe actuel reste inchangé tant que vous ne cliquez pas sur le lien
            </div>
            
            <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            
            <p>Cordialement,<br><strong>L'équipe BEL Institut</strong></p>

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
      from: `"BEL Institut de Beauté" <${process.env.EMAIL_USER}>`,
      to: client.email,
      subject: '🔐 Réinitialisation de votre mot de passe',
      html: emailHtml
    });

    res.status(200).json({
      success: true,
      message: 'Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.'
    });

  } catch (error) {
    console.error('Erreur forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer dans quelques instants.'
    });
  }
};

// Réinitialiser le mot de passe (avec token)
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Informations manquantes pour réinitialiser votre mot de passe'
      });
    }

    // Valider le mot de passe
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Hasher le token reçu
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Vérifier d'abord si le token existe
    const tokenExists = await PasswordResetToken.findOne({
      where: { token: hashedToken }
    });

    if (!tokenExists) {
      return res.status(400).json({
        success: false,
        message: 'Ce lien de réinitialisation n\'est pas valide. Veuillez demander un nouveau lien.'
      });
    }

    // Vérifier si le token a déjà été utilisé
    if (tokenExists.used) {
      return res.status(400).json({
        success: false,
        message: 'Ce lien a déjà été utilisé. Si vous souhaitez changer à nouveau votre mot de passe, demandez un nouveau lien.'
      });
    }

    // Vérifier si le token a expiré
    if (new Date() > tokenExists.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Ce lien a expiré (validité : 1 heure). Demandez un nouveau lien de réinitialisation.'
      });
    }

    // Charger le token avec le client
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token: hashedToken,
        used: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{
        model: Client,
        as: 'client'
      }]
    });

    // Hasher le nouveau mot de passe
    const hashedPassword = await argon2.hash(newPassword);

    // Mettre à jour le mot de passe du client
    await Client.update(
      { password: hashedPassword },
      { where: { id: resetToken.clientId } }
    );

    // Marquer le token comme utilisé
    await resetToken.update({ used: true });

    // Logger l'événement
    logSecurityEvent('PASSWORD_RESET', {
      clientId: resetToken.clientId,
      email: resetToken.client.email,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Votre mot de passe a été modifié avec succès ! Vous pouvez maintenant vous connecter.'
    });

  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer ou demander un nouveau lien.'
    });
  }
};

// Changer mot de passe (client connecté)
const changePassword = async (req, res) => {
  try {
    const clientId = req.client.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs'
      });
    }

    // Valider le nouveau mot de passe
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Récupérer le client
    const client = await Client.findByPk(clientId);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Compte introuvable'
      });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await argon2.verify(client.password, currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Votre mot de passe actuel est incorrect'
      });
    }

    // Vérifier que le nouveau mot de passe est différent
    const isSamePassword = await argon2.verify(client.password, newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit être différent de l\'ancien'
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await argon2.hash(newPassword);

    // Mettre à jour
    await client.update({ password: hashedPassword });

    // Logger l'événement
    logSecurityEvent('PASSWORD_CHANGED', {
      clientId: client.id,
      email: client.email,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Votre mot de passe a été modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors du changement de mot de passe'
    });
  }
};

// ========================================
// MIDDLEWARE
// ========================================

// Middleware : Vérifier la blacklist
const clientAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vous connecter pour accéder à cette page'
      });
    }
    
    // Vérifier si le token est blacklisté
    const isBlacklisted = await BlacklistedToken.findOne({
      where: { token: token }
    });
    
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Votre session a expiré. Veuillez vous reconnecter'
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
        message: 'Votre compte est introuvable ou désactivé'
      });
    }
    
    req.client = client;
    next();
  } catch (error) {
    console.error('Erreur clientAuthMiddleware:', error);
    res.status(401).json({
      success: false,
      message: 'Votre session a expiré. Veuillez vous reconnecter',
      error: error.message
    });
  }
};

// ========================================
// PROFIL CLIENT
// ========================================

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
      message: 'Impossible de charger votre profil. Veuillez réessayer.',
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
      message: 'Vos informations ont été mises à jour avec succès',
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
      message: 'Impossible de mettre à jour votre profil. Veuillez réessayer.',
      error: error.message
    });
  }
};

// ========================================
// SUPPRESSION COMPTE (RGPD)
// ========================================

// Suppression/Anonymisation de compte (RGPD)
const deleteClientAccount = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const clientId = req.client.id;
    const { password, reason } = req.body;
    
    // 1. Vérifier que le mot de passe est correct (sécurité)
    if (!password) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Veuillez entrer votre mot de passe pour confirmer la suppression'
      });
    }
    
    const client = await Client.findByPk(clientId, { transaction });
    
    if (!client) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Compte introuvable'
      });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await argon2.verify(client.password, password);
    
    if (!isPasswordValid) {
      await transaction.rollback();
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }
    
    // 2. Vérifier s'il y a des réservations futures
    const futureBookings = await Booking.findAll({
      where: {
        clientId,
        bookingDate: {
          [Op.gt]: new Date()
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      },
      transaction
    });
    
    if (futureBookings.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Vous avez des réservations à venir. Veuillez les annuler avant de supprimer votre compte.',
        data: {
          futureBookingsCount: futureBookings.length
        }
      });
    }
    
    // 3. ANONYMISATION DES DONNÉES (RGPD)
    const anonymizedEmail = `deleted_${clientId}_${Date.now()}@anonymized.local`;
    const deletionDate = new Date();
    
    await client.update({
      // Anonymiser les données personnelles
      email: anonymizedEmail,
      firstName: 'Utilisateur',
      lastName: 'Supprimé',
      phone: null,
      dateOfBirth: null,
      password: await argon2.hash('ACCOUNT_DELETED_' + Date.now()),
      
      // Marquer comme inactif
      isActive: false,
      emailVerified: false,
      emailVerificationToken: null,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }, { transaction });
    
    // 4. Anonymiser les notes dans les réservations passées
    await Booking.update({
      clientNotes: null,
      notes: null
    }, {
      where: {
        clientId,
        bookingDate: {
          [Op.lt]: new Date()
        }
      },
      transaction
    });
    
    // 5. Révoquer tous les tokens du client
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'beauty_institute_secret_key_2025');
        await BlacklistedToken.create({
          token: token,
          userId: clientId,
          userType: 'client',
          expiresAt: new Date(decoded.exp * 1000),
          reason: 'account_deletion'
        }, { transaction });
      } catch (err) {
        console.log('Token déjà expiré ou invalide');
      }
    }
    
    // 6. Logger l'événement (sécurité)
    logSecurityEvent('ACCOUNT_DELETED', {
      clientId,
      email: client.email, // Email avant anonymisation pour l'audit
      deletionDate,
      reason: reason || 'Demande utilisateur'
    });
    
    await transaction.commit();
    
    res.json({
      success: true,
      message: 'Votre compte a été supprimé avec succès. Toutes vos données personnelles ont été anonymisées.',
      data: {
        deletedAt: deletionDate,
        message: 'Vos données personnelles ont été supprimées. Vos réservations passées sont conservées de manière anonyme pour nos obligations légales.'
      }
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Erreur deleteClientAccount:', error);
    
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la suppression de votre compte',
      error: error.message
    });
  }
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  registerClient,
  loginClient,
  verifyClientToken,
  clientAuthMiddleware,
  getClientProfile,
  updateClientProfile,
  logoutClient,
  deleteClientAccount,
  // ⭐ NOUVELLES FONCTIONS MOT DE PASSE
  forgotPassword,
  resetPassword,
  changePassword
};