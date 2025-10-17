// backend/migrations/add-duration-to-services.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ajouter la colonne duration
    await queryInterface.addColumn('Services', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 60,
      comment: 'Durée en minutes'
    });

    // Ajouter la colonne sortOrder
    await queryInterface.addColumn('Services', 'sortOrder', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      comment: 'Ordre d\'affichage'
    });

    // Mettre à jour les services existants avec des durées par défaut
    await queryInterface.sequelize.query(`
      UPDATE Services 
      SET duration = CASE 
        WHEN category = 'maquillage_permanent' THEN 120
        WHEN category = 'extensions_cils' THEN 90
        WHEN category = 'soins_regard' THEN 30
        ELSE 60
      END
      WHERE duration IS NULL OR duration = 60
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Services', 'duration');
    await queryInterface.removeColumn('Services', 'sortOrder');
  }
};