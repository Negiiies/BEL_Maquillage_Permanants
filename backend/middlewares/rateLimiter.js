const rateLimit = require('express-rate-limit');

// Rate limiter pour les uploads d'images
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 uploads par 15 minutes
  message: {
    success: false,
    message: 'Trop de tentatives d\'upload. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ⭐ Rate limiter pour l'authentification (login/register) - AMÉLIORÉ
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // ⭐ CHANGÉ: 10 au lieu de 5 (plus réaliste pour production)
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // ⭐ AJOUTÉ: Ne compte que les échecs
});

// ⚠️ apiLimiter n'est plus utilisé (gardé pour compatibilité)
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
  apiLimiter // ⚠️ Exporté mais non utilisé
};