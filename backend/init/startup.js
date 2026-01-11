// backend/init/startup.js
const { startAutomaticCleanup } = require('../jobs/cleanupTokens');

const initializeStartupSystems = () => {
  console.log('🚀 Initialisation des systèmes au démarrage...');
  
  try {
    console.log('🧹 Démarrage du nettoyage automatique des tokens...');
    startAutomaticCleanup();
    
    console.log('✅ Tous les systèmes sont initialisés avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error.message);
  }
};

const displaySecurityInfo = () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔐 INFORMATIONS DE SÉCURITÉ');
  console.log('='.repeat(60));
  
  const hasJwtSecret = !!process.env.JWT_SECRET;
  const jwtSecretLength = process.env.JWT_SECRET?.length || 0;
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log(`📌 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 JWT Secret: ${hasJwtSecret ? '✅ Configuré' : '❌ MANQUANT'}`);
  
  if (hasJwtSecret) {
    console.log(`   └─ Longueur: ${jwtSecretLength} caractères ${jwtSecretLength >= 32 ? '✅' : '⚠️  (recommandé: 32+)'}`);
  }
  
  console.log(`💾 Base de données: ${process.env.DB_NAME || 'Non configurée'}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER || 'Non configuré'}`);
  console.log(`🌐 CORS: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  
  if (isProduction) {
    console.log('\n⚠️  MODE PRODUCTION ACTIVÉ');
  }
  
  console.log('='.repeat(60) + '\n');
};

const checkCriticalEnvVars = () => {
  const required = {
    'JWT_SECRET': process.env.JWT_SECRET,
    'DB_HOST': process.env.DB_HOST,
    'DB_NAME': process.env.DB_NAME,
    'DB_USER': process.env.DB_USER
  };
  
  const missing = [];
  
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    console.error('\n❌ ERREUR: Variables d\'environnement manquantes:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nVérifiez votre fichier .env\n');
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Variables critiques manquantes en production');
    } else {
      console.warn('⚠️  L\'application peut ne pas fonctionner correctement\n');
    }
  }
  
  return missing.length === 0;
};

module.exports = {
  initializeStartupSystems,
  displaySecurityInfo,
  checkCriticalEnvVars
};