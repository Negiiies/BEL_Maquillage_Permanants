// 1. backend/models/client.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      // Un client peut avoir plusieurs réservations
      Client.hasMany(models.Booking, {
        foreignKey: 'clientId',
        as: 'bookings'
      });
    }
  }
  
  Client.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: false // Peut contenir des espaces et tirets
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Client',
    tableName: 'Clients',
    timestamps: true,
    hooks: {
      beforeCreate: (client) => {
        // Normaliser l'email en minuscules
        client.email = client.email.toLowerCase().trim();
        client.firstName = client.firstName.trim();
        client.lastName = client.lastName.trim();
      },
      beforeUpdate: (client) => {
        if (client.email) {
          client.email = client.email.toLowerCase().trim();
        }
        if (client.firstName) {
          client.firstName = client.firstName.trim();
        }
        if (client.lastName) {
          client.lastName = client.lastName.trim();
        }
      }
    }
  });
  
  return Client;
};