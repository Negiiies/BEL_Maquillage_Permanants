const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
// Routes API
// app.use('/api/admin', require('./routes/admin')); // Commenter temporairement

// Importer la base de données
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000'], // Frontend Next.js
  credentials: true
}));
app.use(express.json());

// Route de test simple
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Institut de Beauté - Serveur fonctionnel!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

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

// Routes API
app.use('/api/services', require('./routes/services'));
app.use('/api/formations', require('./routes/formations'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

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
        'POST /api/contact - Envoyer un message'
      ],
      admin: [
        'POST /api/admin/login - Connexion admin',
        'POST /api/admin/setup - Créer premier admin',
        'GET /api/admin/dashboard - Statistiques',
        'GET /api/contact - Voir messages (admin)',
        'POST /api/services - Créer prestation (admin)',
        'POST /api/formations - Créer formation (admin)'
      ]
    }
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl,
    availableRoutes: '/api/test-routes'
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
    await db.sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées avec la base de données.');
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📊 Test DB: http://localhost:${PORT}/api/test-db`);
      console.log(`📋 Routes: http://localhost:${PORT}/api/test-routes`);
      console.log(`🎯 API Ready!`);
    });
    
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

startServer();