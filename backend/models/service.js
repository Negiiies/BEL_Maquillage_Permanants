'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.hasMany(models.Booking, {
        foreignKey: 'serviceId',
        as: 'bookings'
      });
      
      Service.hasMany(models.TimeSlot, {
        foreignKey: 'serviceId',
        as: 'timeSlots'
      });
    }
  }
  
  Service.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
      comment: 'Durée en minutes',
      validate: {
        min: 15,
        max: 480
      }
    },
    category: {
      type: DataTypes.ENUM('sourcils', 'levres', 'cils'),  // ✅ NOUVELLE VERSION
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Ordre d\'affichage'
    },
    imageUrl: {
  type: DataTypes.STRING,
  allowNull: true,
  comment: 'URL de l\'image de la prestation'
},
  }, {
    sequelize,
    modelName: 'Service',
    timestamps: true,
    hooks: {
      beforeCreate: (service) => {
        if (service.name) service.name = service.name.trim();
        if (service.description) service.description = service.description.trim();
      },
      beforeUpdate: (service) => {
        if (service.name) service.name = service.name.trim();
        if (service.description) service.description = service.description.trim();
      }
    }
  });
  
  return Service;
};