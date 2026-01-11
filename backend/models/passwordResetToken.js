// backend/models/passwordResetToken.js
module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Clients',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
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
    tableName: 'PasswordResetTokens',
    timestamps: true
  });

  PasswordResetToken.associate = (models) => {
    PasswordResetToken.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client'
    });
  };

  return PasswordResetToken;
};