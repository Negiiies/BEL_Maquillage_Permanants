// 3. Migration create-bookings-table.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      timeSlotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TimeSlots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
        defaultValue: 'pending'
      },
      bookingDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Durée en minutes'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Notes de l\'admin'
      },
      clientNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Notes du client'
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'partially_paid', 'refunded'),
        defaultValue: 'pending'
      },
      reminderSent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      confirmationSent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancelledBy: {
        type: Sequelize.ENUM('client', 'admin', 'system'),
        allowNull: true
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true
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

    // Index pour améliorer les performances
    await queryInterface.addIndex('Bookings', ['clientId']);
    await queryInterface.addIndex('Bookings', ['serviceId']);
    await queryInterface.addIndex('Bookings', ['timeSlotId']);
    await queryInterface.addIndex('Bookings', ['status']);
    await queryInterface.addIndex('Bookings', ['bookingDate']);
    await queryInterface.addIndex('Bookings', ['clientId', 'status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};