const rateLimit = require('express-rate-limit');

// Rate limiter pour les uploads d'images
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 uploads par 15 minutes
  message: {
    success: false,
    message: 'Trop de tentatives d\'upload. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true, // Retourne les headers RateLimit
  legacyHeaders: false,
});

// Rate limiter pour l'authentification (login)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 tentatives de connexion par 15 minutes
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter général pour les API publiques
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requêtes par 15 minutes
  message: {
    success: false,
    message: 'Trop de requêtes. Veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  uploadLimiter,
  authLimiter,
  apiLimiter
};