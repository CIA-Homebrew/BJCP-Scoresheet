'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
			id: {
				type: Sequelize.UUID,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				autoIncrement: false,
			},
			firstname: {
				type: Sequelize.STRING,
				isEmpty: {
					msg: "A first name is required."
				}
			},
			lastname: {
				type: Sequelize.STRING,
				isEmpty: {
					msg: "A last name is required."
				}
			},
			email: {
				type: Sequelize.STRING,
				isEmail:  {
					msg: "Invalid email address provided."
				}
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			phone: Sequelize.STRING,
			bjcp_id: Sequelize.STRING,
			bjcp_rank: Sequelize.STRING,
			cicerone_rank: Sequelize.STRING,
			pro_brewer_brewery: Sequelize.STRING,
			industry_description: Sequelize.STRING,
			judging_years: Sequelize.STRING,
			user_level: {
				type: Sequelize.INTEGER,
				require: true,
				default: 0
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
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Users');
	}
};