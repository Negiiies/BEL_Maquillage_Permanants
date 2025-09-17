// backend/models/service.js - VERSION MISE À JOUR
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      // NOUVELLES ASSOCIATIONS pour le système de réservation
      
      // Un service peut avoir plusieurs réservations
      Service.hasMany(models.Booking, {
        foreignKey: 'serviceId',
        as: 'bookings'
      });
      
      // Un service peut avoir des créneaux spécifiques
      Service.hasMany(models.TimeSlot, {
        foreignKey: 'serviceId',
        as: 'timeSlots'
      });
    }
  }
  
  Service.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    category: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Service',
  });
  
  return Service;
};