'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔄 Migration Formations : Début...');

    // Étape 1 : Désactiver contraintes
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Étape 2 : Vérifier si la table existe avant de sauvegarder
    const [tables] = await queryInterface.sequelize.query(
      "SHOW TABLES LIKE 'Formations'"
    );
    
    let oldFormations = [];
    if (tables.length > 0) {
      // La table existe, on sauvegarde les données
      [oldFormations] = await queryInterface.sequelize.query('SELECT * FROM Formations');
      console.log(`📚 ${oldFormations.length} formations existantes trouvées`);
      
      // Étape 3 : Supprimer l'ancienne table
      await queryInterface.dropTable('Formations');
      console.log('✅ Ancienne table Formations supprimée');
    } else {
      console.log('ℹ️ Table Formations inexistante, création directe');
    }

    // Étape 4 : Créer la nouvelle table
    await queryInterface.createTable('Formations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category: {
        type: Sequelize.ENUM('pigmentation', 'regard_sourcils'),
        allowNull: false
      },
      level: {
        type: Sequelize.ENUM('debutant', 'intermediaire', 'avance'),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    console.log('✅ Nouvelle table Formations créée');

    // Étape 5 : Insérer les nouvelles formations
    await queryInterface.bulkInsert('Formations', [
      // PIGMENTATION
      {
        title: 'Formation Ombré Brow',
        description: 'Apprenez la technique de l\'ombré brow pour un résultat naturel et professionnel',
        price: 1200.00,
        duration: '2 jours',
        category: 'pigmentation',
        level: 'intermediaire',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Formation Bel'ips (Lèvres)",
        description: 'Maîtrisez l\'art du maquillage permanent des lèvres',
        price: 1500.00,
        duration: '2 jours',
        category: 'pigmentation',
        level: 'avance',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // REGARD & SOURCILS
      {
        title: 'Formation Browlift',
        description: 'Apprenez la technique du Brow Lift pour restructurer les sourcils',
        price: 600.00,
        duration: '1 jour',
        category: 'regard_sourcils',
        level: 'debutant',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Formation Teinture Hybride',
        description: 'Maîtrisez la teinture hybride des sourcils',
        price: 400.00,
        duration: '1 jour',
        category: 'regard_sourcils',
        level: 'debutant',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Formation Brow Expert 3 en 1',
        description: 'Formation complète combinant Brow Lift, Teinture et modelage',
        price: 900.00,
        duration: '2 jours',
        category: 'regard_sourcils',
        level: 'intermediaire',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Formation Lash Lift Coréen',
        description: 'Technique coréenne de rehaussement des cils',
        price: 500.00,
        duration: '1 jour',
        category: 'regard_sourcils',
        level: 'debutant',
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ 6 nouvelles formations insérées');

    // Étape 6 : Réactiver contraintes
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✨ Migration Formations terminée avec succès !');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.dropTable('Formations');
    
    await queryInterface.createTable('Formations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL
      },
      duration: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.STRING
      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('↩️ Rollback effectué');
  }
};