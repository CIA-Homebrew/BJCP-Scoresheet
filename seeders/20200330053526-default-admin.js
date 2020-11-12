'use strict';
let User = require('../models').User;

module.exports = {
	up: (queryInterface, Sequelize) => {
		return User.create({
			firstname: 'Default',
			lastname: 'Admin',
			email: 'admin@scoresheets.org',
			password: 'password',
			phone: '',
			bjcp_id: '',
			bjcp_rank: '',
			cicerone_rank: '',
			pro_brewer_brewery: '',
			industry_description: '',
			judging_years: '',
			user_level: 999
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Users', {where: { firstname: 'Default', lastname: 'Admin' }}, {});
	}
};
