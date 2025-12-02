const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Formation = sequelize.define('Formation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Durée de la formation (ex: "2 jours", "1 semaine")'
    },
    category: {
      type: DataTypes.ENUM('pigmentation', 'regard_sourcils'),
      allowNull: false,
      comment: 'Catégorie principale (ancien système)'
    },
    subcategory: {
      type: DataTypes.ENUM('cils', 'levres', 'sourcils'),
      allowNull: false,
      defaultValue: 'sourcils',
      comment: 'Sous-catégorie de la formation (nouveau système)'
    },
    level: {
      type: DataTypes.ENUM('debutant', 'intermediaire', 'avance'),
      allowNull: false,
      defaultValue: 'debutant'
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL de l\'image de la formation'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Ordre d\'affichage des formations'
    }
  }, {
    tableName: 'Formations',
    timestamps: true
  });

  return Formation;
};