'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Flights', {
      id: {
        type: Sequelize.UUID,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				autoIncrement: false,
      },
      flight_id: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.sequelize.transaction(t => {
      queryInterface.addColumn('Scoresheets', 'flightKey', {
        type: Sequelize.UUID,
				references: {
					model: {
            tableName: 'Flights'
          },
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
        allowNull: true,
        transaction: t
      })
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(t => {
      queryInterface.removeColumn('Scoresheets', 'flightKey', {transaction: t})
    })

    await queryInterface.dropTable('Flights');
  }
};