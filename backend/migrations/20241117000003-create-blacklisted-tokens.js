'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BlacklistedTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING(500),  // ✅ Changé de TEXT à STRING(500)
        allowNull: false,
        unique: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      userType: {
        type: Sequelize.ENUM('admin', 'client'),
        allowNull: true
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'logout'
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

    // Ajouter l'index sur expiresAt seulement
    await queryInterface.addIndex('BlacklistedTokens', ['expiresAt'], {
      name: 'blacklisted_tokens_expires_at'
    });

    console.log('✅ Table BlacklistedTokens créée');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BlacklistedTokens');
    console.log('↩️ Table BlacklistedTokens supprimée');
  }
};