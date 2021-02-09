"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("Scoresheets", {
      fields: ["FlightId"],
      type: "foreign key",
      references: {
        table: "Flights",
        field: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("Scoresheets", {
      fields: ["FlightId"],
      type: "foreign key",
      references: {
        table: "Flights",
        field: "id",
      },
      onDelete: "SET_NULL",
    });
  },
};
