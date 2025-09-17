// 2. Migration create-time-slots-table.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TimeSlots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      serviceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      maxBookings: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      currentBookings: {
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

    // Index pour améliorer les performances des requêtes
    await queryInterface.addIndex('TimeSlots', ['date', 'isAvailable']);
    await queryInterface.addIndex('TimeSlots', ['serviceId']);
    await queryInterface.addIndex('TimeSlots', ['date', 'startTime']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TimeSlots');
  }
};
