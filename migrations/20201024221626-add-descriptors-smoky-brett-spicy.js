'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(t => {
      queryInterface.addColumn('Scoresheets', 'descriptor_spicy', {
        type: Sequelize.BOOLEAN,
        default: false,
        transaction: t
      })
      queryInterface.addColumn('Scoresheets', 'descriptor_smoky', {
        type: Sequelize.BOOLEAN,
        default: false,
        transaction: t
      })
      queryInterface.addColumn('Scoresheets', 'descriptor_brettanomyces', {
        type: Sequelize.BOOLEAN,
        default: false,
        transaction: t
      })

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(t => {
      queryInterface.removeColumn('Scoresheets', 'descriptor_spicy', {transaction: t})
      queryInterface.removeColumn('Scoresheets', 'descriptor_smoky', {transaction: t})
      queryInterface.removeColumn('Scoresheets', 'descriptor_brettanomyces', {transaction: t})
    })
  }
};
