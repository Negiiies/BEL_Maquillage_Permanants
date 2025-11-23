'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Formation extends Model {
    static associate(models) {
      // associations si besoin plus tard
    }
  }
  
  Formation.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Durée de la formation (ex: "2 jours", "3h")'
    },
    category: {
      type: DataTypes.ENUM('pigmentation', 'regard_sourcils'),  // ✅ NOUVELLE CATÉGORIE
      allowNull: false
    },
    level: {
      type: DataTypes.ENUM('debutant', 'intermediaire', 'avance'),
      allowNull: true,
      comment: 'Niveau de difficulté (optionnel)'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Ordre d\'affichage'
    }
  }, {
    sequelize,
    modelName: 'Formation',
    timestamps: true,
    hooks: {
      beforeCreate: (formation) => {
        if (formation.title) formation.title = formation.title.trim();
        if (formation.description) formation.description = formation.description.trim();
      },
      beforeUpdate: (formation) => {
        if (formation.title) formation.title = formation.title.trim();
        if (formation.description) formation.description = formation.description.trim();
      }
    }
  });
  
  return Formation;
};