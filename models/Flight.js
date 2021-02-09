// "use strict";

module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define(
    "Flight",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      flight_id: DataTypes.STRING,
      location: DataTypes.STRING,
      date: DataTypes.STRING,
      submitted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Flight",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Flight.associate = function (models) {
    Flight.hasMany(models.Scoresheet, { onDelete: "CASCADE", hooks: true });
    Flight.belongsTo(models.User);
  };

  return Flight;
};
