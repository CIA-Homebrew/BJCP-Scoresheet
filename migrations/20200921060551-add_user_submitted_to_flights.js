"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      queryInterface.addColumn("Flights", "created_by", {
        type: Sequelize.UUID,
      });
      queryInterface.addColumn("Flights", "submitted", {
        type: Sequelize.BOOLEAN,
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      queryInterface.removeColumn("Flights", "submitted", { transaction: t });
      queryInterface.removeColumn("Flights", "created_by", { transaction: t });
    });
  },
};
