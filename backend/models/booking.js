// 3. backend/models/booking.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Une réservation appartient à un client
      Booking.belongsTo(models.Client, {
        foreignKey: 'clientId',
        as: 'client'
      });
      
      // Une réservation concerne un service
      Booking.belongsTo(models.Service, {
        foreignKey: 'serviceId',
        as: 'service'
      });
      
      // Une réservation occupe un créneau
      Booking.belongsTo(models.TimeSlot, {
        foreignKey: 'timeSlotId',
        as: 'timeSlot'
      });
    }
  }
  
  Booking.init({
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timeSlotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
      defaultValue: 'pending'
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date() // Ne peut pas être dans le passé
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 15, // Minimum 15 minutes
        max: 300 // Maximum 5 heures
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    clientNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'partially_paid', 'refunded'),
      defaultValue: 'pending'
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    confirmationSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelledBy: {
      type: DataTypes.ENUM('client', 'admin', 'system'),
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'Bookings',
    timestamps: true,
    hooks: {
      beforeCreate: (booking) => {
        // S'assurer que les notes sont trimées
        if (booking.notes) booking.notes = booking.notes.trim();
        if (booking.clientNotes) booking.clientNotes = booking.clientNotes.trim();
      },
      beforeUpdate: (booking) => {
        if (booking.notes) booking.notes = booking.notes.trim();
        if (booking.clientNotes) booking.clientNotes = booking.clientNotes.trim();
        
        // Si on annule, définir la date d'annulation
        if (booking.status === 'cancelled' && !booking.cancelledAt) {
          booking.cancelledAt = new Date();
        }
      }
    }
  });
  
  return Booking;
};