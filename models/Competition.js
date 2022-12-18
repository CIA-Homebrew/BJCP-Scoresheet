// "use strict";

module.exports = (sequelize, DataTypes) => {
  const Competition = sequelize.define(
    "Competition",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: DataTypes.TEXT,
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      info: DataTypes.TEXT,
      instruction: DataTypes.TEXT,
      club: DataTypes.TEXT,
      clubLogo: DataTypes.TEXT,
      compLogo: DataTypes.TEXT,
      styleGuide: DataTypes.TEXT,
      show_bjcp_logo: DataTypes.BOOLEAN,
      show_aha_logo: DataTypes.BOOLEAN,
      sponsor: DataTypes.JSON,
      entryInfo: DataTypes.JSON,
      judgeInfo: DataTypes.JSON,
      options: DataTypes.JSON,
      colorScheme: DataTypes.JSON,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Competition",
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  Competition.associate = function (models) {
    Competition.hasMany(models.Flight, { onDelete: "CASCADE", hooks: true });
    Competition.belongsToMany(models.User, { through: models.UserCompetition });
  };

  return Competition;
};
