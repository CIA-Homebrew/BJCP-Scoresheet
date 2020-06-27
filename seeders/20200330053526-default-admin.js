'use strict';
let User = require('../models').User;

module.exports = {
	up: (queryInterface, Sequelize) => {
		return User.create({
			firstname: 'Default',
			lastname: 'Admin',
			email: 'admin@scoresheets.org',
			password: 'UL59$0w4wQChT2T',
			phone: '',
			bjcp_id: '',
			bjcp_rank: '',
			cicerone_rank: '',
			pro_brewer_brewery: '',
			industry_description: '',
			judging_years: '',
			user_level: 90
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Users', {where: { firstname: 'Default', lastname: 'Admin' }}, {});
	}
};
