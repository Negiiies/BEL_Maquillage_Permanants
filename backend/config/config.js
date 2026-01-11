// backend/config/config.js
// Configuration de la base de données avec variables d'environnement

require('dotenv').config();

// Validation des variables d'environnement critiques
const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

if (process.env.NODE_ENV === 'production') {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `❌ ERREUR FATALE: Variables d'environnement manquantes: ${missingVars.join(', ')}\n` +
      `Vérifiez votre fichier .env.production`
    );
  }
}

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'beauty_institute_dev',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: console.log,
    timezone: '+01:00'
  },
  
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'beauty_institute_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    timezone: '+01:00'
  },
  
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    timezone: '+01:00',
    
    // Configuration de pool optimisée pour production
    pool: {
      max: 10,           // Nombre max de connexions
      min: 2,            // Nombre min de connexions
      acquire: 30000,    // Timeout pour acquérir une connexion (30s)
      idle: 10000        // Temps avant de fermer une connexion inactive (10s)
    },
    
    // Options de sécurité
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: true
      } : false,
      connectTimeout: 60000
    },
    
    // Retry logic
    retry: {
      max: 3,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ]
    }
  }
};