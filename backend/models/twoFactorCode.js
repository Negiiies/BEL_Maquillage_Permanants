// backend/models/twoFactorCode.js
module.exports = (sequelize, DataTypes) => {
  const TwoFactorCode = sequelize.define('TwoFactorCode', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'TwoFactorCodes',
    timestamps: true
  });

  TwoFactorCode.associate = (models) => {
    TwoFactorCode.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return TwoFactorCode;
};