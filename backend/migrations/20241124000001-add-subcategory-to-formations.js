'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajouter la colonne subcategory
    await queryInterface.addColumn('Formations', 'subcategory', {
      type: Sequelize.ENUM('cils', 'levres', 'sourcils'),
      allowNull: false,
      defaultValue: 'sourcils',
      comment: 'Sous-catégorie de la formation (cils, lèvres, sourcils)'
    });

    console.log('✅ Colonne subcategory ajoutée à la table Formations');
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimer la colonne subcategory
    await queryInterface.removeColumn('Formations', 'subcategory');
    
    // Supprimer l'ENUM
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS \"enum_Formations_subcategory\";"
    );

    console.log('✅ Colonne subcategory supprimée de la table Formations');
  }
};