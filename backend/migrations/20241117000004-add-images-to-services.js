'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Services', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL de l\'image de la prestation'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Services', 'imageUrl');
  }
};