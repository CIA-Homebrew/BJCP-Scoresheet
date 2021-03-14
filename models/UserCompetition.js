// "use strict";

module.exports = (sequelize, DataTypes) => {
  const UserCompetition = sequelize.define(
    "UserCompetition",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      UserId: {
        type: DataTypes.UUID,
        references: {
          model: "User",
          key: "id",
        },
      },
      CompetitionId: {
        type: DataTypes.UUID,
        references: {
          model: "Competition",
          key: "id",
        },
      },
      isAdmin: DataTypes.NUMBER,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "UserCompetition",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  UserCompetition.associate = function (models) {};

  return UserCompetition;
};
