'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlacklistedToken extends Model {
    static associate(models) {
      // Pas d'association nécessaire pour l'instant
    }
  }
  
  BlacklistedToken.init({
   token: {
  type: DataTypes.STRING(500),  // ✅ Changé de TEXT à STRING(500)
  allowNull: false,
  unique: true,
  comment: 'Token JWT révoqué'
},
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID de l\'utilisateur (admin ou client)'
    },
    userType: {
      type: DataTypes.ENUM('admin', 'client'),
      allowNull: true,
      comment: 'Type d\'utilisateur'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Date d\'expiration originale du token'
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'logout',
      comment: 'Raison de la révocation (logout, security, etc.)'
    }
  }, {
    sequelize,
    modelName: 'BlacklistedToken',
    tableName: 'BlacklistedTokens',
    timestamps: true,
    indexes: [
      {
        fields: ['token'],
        unique: true
      },
      {
        fields: ['expiresAt']
      }
    ]
  });
  
  return BlacklistedToken;
};