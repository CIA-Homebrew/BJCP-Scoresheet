"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      queryInterface.addColumn("Users", "verification_id", {
        type: Sequelize.STRING,
      });
      queryInterface.addColumn("Users", "password_reset_id", {
        type: Sequelize.STRING,
      });
      queryInterface.addColumn("Users", "allow_automated_email", {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      });
      queryInterface.addColumn("Users", "email_verified", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction((t) => {
      queryInterface.removeColumn("Users", "email_verified", {
        transaction: t,
      });
      queryInterface.removeColumn("Users", "allow_automated_email", {
        transaction: t,
      });
      queryInterface.removeColumn("Users", "password_reset_id", {
        transaction: t,
      });
      queryInterface.removeColumn("Users", "verification_id", {
        transaction: t,
      });
    });
  },
};
