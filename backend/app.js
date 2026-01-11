const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Importer la base de données
const db = require('./models');

// ✅ Importer les rate limiters
const { uploadLimiter, authLimiter } = require('./middlewares/rateLimiter');

// ✅ NOUVEAU : Importer les systèmes de sécurité
const { initializeStartupSystems, displaySecurityInfo, checkCriticalEnvVars } = require('./init/startup');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ NOUVEAU : Vérifier les variables d'environnement critiques au démarrage
checkCriticalEnvVars();

// Middlewares de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Pour servir les images
}));

// ✅ MODIFIÉ : CORS dynamique selon l'environnement
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.CORS_ALLOWED_ORIGINS?.split(',') || [])
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ MODIFIÉ : Limiter la taille des requêtes (protection DoS)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images uploadées)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Route de test simple
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Institut de Beauté - Serveur fonctionnel!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ✅ MODIFIÉ : Routes de debug désactivées en production
if (process.env.NODE_ENV !== 'production') {
  // Route de test base de données
  app.get('/api/test-db', async (req, res) => {
    try {
      await db.sequelize.authenticate();
      res.json({ 
        message: 'Connexion à la base de données réussie!',
        database: db.sequelize.config.database,
        host: db.sequelize.config.host,
        dialect: db.sequelize.config.dialect
      });
    } catch (error) {
      console.error('Erreur de connexion à la base:', error);
      res.status(500).json({ 
        message: 'Erreur de connexion à la base de données',
        error: error.message 
      });
    }
  });

  // Route pour voir les modèles créés
  app.get('/api/models', (req, res) => {
    const modelNames = Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize');
    res.json({
      message: 'Modèles disponibles',
      models: modelNames
    });
  });

  // Route pour tester toutes les APIs
  app.get('/api/test-routes', (req, res) => {
    res.json({
      message: 'Routes API disponibles',
      routes: {
        public: [
          'GET /api/services - Toutes les prestations',
          'GET /api/services/category/:category - Prestations par catégorie',
          'GET /api/formations - Toutes les formations',
          'GET /api/formations/level/:level - Formations par niveau',
          'GET /api/timeslots/available - Créneaux disponibles',
          'POST /api/bookings - Créer une réservation (authentifié)',
          'GET /uploads/services/* - Images des prestations'
        ],
        withRateLimit: [
          'POST /api/auth/login - Connexion client [Rate limited: 10 échecs/15min]',
          'POST /api/auth/register - Inscription client [Rate limited: 10 échecs/15min]',
          'POST /api/contact - Envoyer un message [Rate limited: 10/15min]',
          'POST /api/admin/login - Connexion admin [Rate limited: 10 échecs/15min]',
          'POST /api/admin/upload/* - Upload images [Rate limited: 10/15min]'
        ],
        withoutRateLimit: [
          'GET /api/auth/profile - Profil client (AUCUNE limite)',
          'GET /api/services - Services (AUCUNE limite)',
          'GET /api/timeslots - Créneaux (AUCUNE limite)',
          'POST /api/bookings - Réservations (AUCUNE limite)',
          'Navigation normale (AUCUNE limite)'
        ],
        admin: [
          'POST /api/admin/setup - Créer premier admin',
          'GET /api/admin/dashboard - Statistiques',
          'GET /api/admin/services - Gérer prestations',
          'GET /api/admin/bookings - Gérer réservations',
          'GET /api/admin/timeslots - Gérer créneaux'
        ],
        security: [
          '✅ Rate Limiting ciblé (login, register, contact, upload)',
          '✅ Ne compte QUE les échecs (skipSuccessfulRequests)',
          '❌ PAS de rate limiting sur navigation normale',
          '🔐 JWT Authentication pour routes protégées',
          '✅ Logs de sécurité actifs',
          '✅ Nettoyage automatique des tokens'
        ]
      }
    });
  });
}

// ========================================
// ROUTES API PUBLIQUES (sans rate limiting)
// ========================================
app.use('/api/services', require('./routes/services'));
app.use('/api/formations', require('./routes/formations'));
app.use('/api/inscriptions', require('./routes/inscription'));
app.use('/api/timeslots', require('./routes/timeslots'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/client', require('./routes/client'));

// ========================================
// ROUTES AVEC RATE LIMITING SPÉCIFIQUE
// ========================================

// ✅ Routes authentification (rate limiting géré dans auth.js)
app.use('/api/auth', require('./routes/auth'));

// ✅ Routes contact avec rate limiter (max 10 messages/15min)
app.use('/api/contact', authLimiter, require('./routes/contact'));

// ========================================
// ROUTES ADMIN (sans rate limiting global)
// ========================================
app.use('/api/admin', require('./routes/admin'));

// ✅ Routes d'upload avec rate limiter spécifique (max 10 uploads/15min)
app.use('/api/admin/upload', uploadLimiter, require('./routes/upload'));

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl,
    availableRoutes: process.env.NODE_ENV !== 'production' ? '/api/test-routes' : undefined
  });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong!'
  });
});

// Démarrer le serveur
const startServer = async () => {
  try {
    // Tester la connexion à la base
    await db.sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');
    
    // Synchroniser les modèles (créer les tables)
    await db.sequelize.sync({ alter: false });
    console.log('✅ Tables synchronisées avec la base de données.');
    
    // ✅ NOUVEAU : Initialiser les systèmes de sécurité
    initializeStartupSystems();
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      // ✅ NOUVEAU : Afficher les informations de sécurité
      displaySecurityInfo();
      
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📊 Test DB: http://localhost:${PORT}/api/test-db`);
        console.log(`📋 Routes: http://localhost:${PORT}/api/test-routes`);
      }
      
      console.log(`📸 Uploads: http://localhost:${PORT}/uploads/services/`);
      console.log(`🛡️  Sécurité:`);
      console.log(`   ├── Rate Limiting: Ciblé et intelligent`);
      console.log(`   ├── CORS: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}`);
      console.log(`   ├── Logs de sécurité: Actifs`);
      console.log(`   └── Nettoyage tokens: Automatique (6h)`);
      console.log(`\n🎯 API ${process.env.NODE_ENV === 'production' ? 'EN PRODUCTION' : 'EN DÉVELOPPEMENT'} !`);
    });
    
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

startServer();