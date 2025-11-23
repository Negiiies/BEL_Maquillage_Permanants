'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔄 Migration Services : Début...');

    // Étape 1 : Désactiver temporairement les contraintes de clés étrangères
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Étape 2 : Sauvegarder les anciens services (au cas où il y a des réservations liées)
    const [oldServices] = await queryInterface.sequelize.query(
      'SELECT * FROM Services'
    );
    console.log(`📦 ${oldServices.length} services existants trouvés`);

    // Étape 3 : Supprimer la table Services
    await queryInterface.dropTable('Services');
    console.log('✅ Ancienne table Services supprimée');

    // Étape 4 : Recréer la table Services avec la nouvelle structure
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
        comment: 'Durée en minutes'
      },
      category: {
        type: Sequelize.ENUM('sourcils', 'levres', 'cils'),
        allowNull: false
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
    console.log('✅ Nouvelle table Services créée');

    // Étape 5 : Insérer les nouveaux services
    await queryInterface.bulkInsert('Services', [
      // SOURCILS
      {
        name: 'Ombré Brow',
        description: 'Technique de maquillage permanent pour des sourcils effet poudré naturel et sophistiqué',
        price: 380.00,
        duration: 120,
        category: 'sourcils',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Combo Brow',
        description: 'Combinaison microblading + ombré pour un effet naturel et défini',
        price: 420.00,
        duration: 150,
        category: 'sourcils',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Brow Lift',
        description: 'Restructuration et lifting des sourcils pour un regard ouvert',
        price: 45.00,
        duration: 45,
        category: 'sourcils',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teinture Hybride',
        description: 'Coloration hybride longue durée pour des sourcils intensifiés',
        price: 35.00,
        duration: 30,
        category: 'sourcils',
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Brow Lift + Teinture',
        description: 'Formule complète : lifting et teinture pour un résultat optimal',
        price: 70.00,
        duration: 60,
        category: 'sourcils',
        isActive: true,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // LÈVRES
      {
        name: "Bel'ips",
        description: 'Maquillage permanent des lèvres pour un contour défini et une couleur naturelle durable',
        price: 420.00,
        duration: 120,
        category: 'levres',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dark Lips Neutralisation',
        description: 'Neutralisation des lèvres foncées pour retrouver une teinte rosée',
        price: 380.00,
        duration: 90,
        category: 'levres',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // CILS
      {
        name: 'Lash Lift Coréen',
        description: 'Rehaussement des cils technique coréenne pour un regard ouvert et lumineux',
        price: 60.00,
        duration: 45,
        category: 'cils',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ 8 nouveaux services insérés');

    // Étape 6 : Réactiver les contraintes
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✨ Migration Services terminée avec succès !');
  },

  async down(queryInterface, Sequelize) {
    // Rollback : revenir à l'ancienne structure
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.dropTable('Services');
    
    // Recréer l'ancienne structure
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL
      },
      category: {
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