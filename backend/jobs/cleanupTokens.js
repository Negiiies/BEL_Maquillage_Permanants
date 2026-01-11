// backend/jobs/cleanupTokens.js
const { BlacklistedToken } = require('../models');
const { Op } = require('sequelize');

const cleanupExpiredTokens = async () => {
  try {
    const now = new Date();
    
    const expiredCount = await BlacklistedToken.count({
      where: {
        expiresAt: {
          [Op.lt]: now
        }
      }
    });
    
    if (expiredCount === 0) {
      console.log('🧹 [Cleanup Tokens] Aucun token expiré à nettoyer');
      return { deleted: 0 };
    }
    
    const deleted = await BlacklistedToken.destroy({
      where: {
        expiresAt: {
          [Op.lt]: now
        }
      }
    });
    
    console.log(`🧹 [Cleanup Tokens] ${deleted} token(s) expiré(s) supprimé(s)`);
    
    const remaining = await BlacklistedToken.count();
    console.log(`📊 [Cleanup Tokens] ${remaining} token(s) actif(s) restant(s)`);
    
    return { deleted, remaining };
  } catch (error) {
    console.error('❌ [Cleanup Tokens] Erreur:', error.message);
    return { error: error.message };
  }
};

const startAutomaticCleanup = () => {
  console.log('🚀 [Cleanup Tokens] Démarrage du nettoyage automatique');
  
  cleanupExpiredTokens();
  
  const cleanupInterval = setInterval(() => {
    console.log('⏰ [Cleanup Tokens] Exécution du nettoyage planifié...');
    cleanupExpiredTokens();
  }, 6 * 60 * 60 * 1000); // 6 heures
  
  process.on('SIGTERM', () => {
    console.log('🛑 [Cleanup Tokens] Arrêt du nettoyage automatique');
    clearInterval(cleanupInterval);
  });
  
  return { cleanupInterval };
};

module.exports = {
  cleanupExpiredTokens,
  startAutomaticCleanup
};