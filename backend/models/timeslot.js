// 2. backend/models/timeslot.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TimeSlot extends Model {
    static associate(models) {
      // Un créneau peut avoir plusieurs réservations (rare mais possible)
      TimeSlot.hasMany(models.Booking, {
        foreignKey: 'timeSlotId',
        as: 'bookings'
      });
      
      // Un créneau peut être lié à un service spécifique (optionnel)
      TimeSlot.belongsTo(models.Service, {
        foreignKey: 'serviceId',
        as: 'service'
      });
    }
  }
  
  TimeSlot.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0] // Ne peut pas être dans le passé
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        isAfterStartTime(value) {
          if (value <= this.startTime) {
            throw new Error('L\'heure de fin doit être après l\'heure de début');
          }
        }
      }
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: true // null = disponible pour tous les services
    },
    maxBookings: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10 // Maximum raisonnable
      }
    },
    currentBookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        isNotGreaterThanMax(value) {
          if (value > this.maxBookings) {
            throw new Error('Le nombre de réservations ne peut pas dépasser le maximum');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'TimeSlot',
    tableName: 'TimeSlots',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['date', 'startTime', 'endTime', 'serviceId']
      }
    ]
  });
  
  return TimeSlot;
};