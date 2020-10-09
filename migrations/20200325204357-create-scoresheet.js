'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Scoresheets', {
			id: {
				type: Sequelize.UUID,
				primaryKey: true,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				autoIncrement: false,
			},
			session_date: {
				type: Sequelize.DATE,
				default: Sequelize.NOW
			},
			session_location: {
				type: Sequelize.STRING,
				allowNull: true
			},
			category: {
				type: Sequelize.STRING,
				allowNull: true
			},
			sub: {
				type: Sequelize.STRING,
				allowNull: true
			},
			subcategory: {
				type: Sequelize.STRING,
				allowNull: true
			},
			special_ingredients_check: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			special_ingredients: Sequelize.TEXT,
			entry_number: {
				type: Sequelize.STRING,
				allowNull: true,
				index: true,
				unique: true
			},
			flight_position: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			flight_total: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			mini_boss_advanced: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			place: Sequelize.INTEGER,
			consensus_score: Sequelize.FLOAT,
			bottle_inspection_check: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			bottle_inspection_comment: Sequelize.TEXT,
			aroma_score: {
				type: Sequelize.FLOAT,
				default: 0
			},
			aroma_malt: Sequelize.TEXT,
			aroma_malt_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			aroma_malt_comment: Sequelize.TEXT,
			aroma_hops: Sequelize.TEXT,
			aroma_hops_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			aroma_hops_comment: Sequelize.TEXT,
			aroma_fermentation: Sequelize.TEXT,
			aroma_fermentation_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			aroma_fermentation_comment: Sequelize.TEXT,
			aroma_other_comment: Sequelize.TEXT,
			appearance_score: {
				type: Sequelize.FLOAT,
				default: 0
			},
			appearance_color: Sequelize.TEXT,
			appearance_color_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			appearance_color_other: Sequelize.TEXT,
			appearance_clarity: Sequelize.TEXT,
			appearance_clarity_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			appearance_head: Sequelize.TEXT,
			appearance_head_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			appearance_head_other: Sequelize.TEXT,
			appearance_retention: Sequelize.TEXT,
			appearance_retention_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			appearance_other_comment: Sequelize.TEXT,
			appearance_texture_comment: Sequelize.TEXT,
			descriptor_acetaldehyde: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_alcoholic: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_astringent: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_diacetyl: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_dms: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_estery: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_grassy: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_lightstruck: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_metallic: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_musty: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_oxidized: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_phenolic: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_solvent: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_sour: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_sulfur: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_vegetal: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			descriptor_yeasty: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_score: {
				type: Sequelize.FLOAT,
				default: 0
			},
			flavor_malt: Sequelize.TEXT,
			flavor_malt_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_malt_comment: Sequelize.TEXT,
			flavor_hops: Sequelize.TEXT,
			flavor_hops_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_hops_comment: Sequelize.TEXT,
			flavor_bitterness: Sequelize.TEXT,
			flavor_bitterness_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_bitterness_comment: Sequelize.TEXT,
			flavor_fermentation: Sequelize.TEXT,
			flavor_fermentation_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_fermentation_comment: Sequelize.TEXT,
			flavor_balance: Sequelize.TEXT,
			flavor_balance_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_balance_comment: Sequelize.TEXT,
			flavor_finish_aftertaste: Sequelize.TEXT,
			flavor_finish_aftertaste_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_finish_aftertaste_comment: Sequelize.TEXT,
			flavor_other_comment: Sequelize.TEXT,
			mouthfeel_score: {
				type: Sequelize.FLOAT,
				default: 0
			},
			mouthfeel_body: Sequelize.TEXT,
			mouthfeel_body_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_carbonation: Sequelize.TEXT,
			mouthfeel_carbonation_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_warmth: Sequelize.TEXT,
			mouthfeel_warmth_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_creaminess: Sequelize.TEXT,
			mouthfeel_creaminess_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_astringency: Sequelize.TEXT,
			mouthfeel_astringency_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_other_comment: Sequelize.TEXT,
			overall_score: {
				type: Sequelize.FLOAT,
				default: 0
			},
			overall_class_example: Sequelize.TEXT,
			overall_flawless: Sequelize.TEXT,
			overall_wonderful: Sequelize.TEXT,
			feedback_comment: Sequelize.TEXT,
			judge_total: {
				type: Sequelize.FLOAT,
				default: 0
			},
			scoresheet_submitted: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			user_id: {
				type: Sequelize.UUID,
				references: {
					model: 'Users',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
				allowNull: true
			},
			judge_id: {
				type: Sequelize.TEXT,
				allowNull: true
			},
			judge_name: {
				type: Sequelize.TEXT,
				allowNull: true
			},
			judge_email: {
				type: Sequelize.TEXT,
				allowNull: true
			},
			judge_bjcp_id: Sequelize.TEXT,
			judge_bjcp_rank: Sequelize.TEXT,
			judge_cicerone_rank: Sequelize.TEXT,
			judge_pro_brewer_brewery: Sequelize.TEXT,
			judge_industry_description: Sequelize.TEXT,
			judge_judging_years: Sequelize.TEXT,
		});
	},

	down: (queryInterface, Sequelize) => {
		  return queryInterface.dropTable('scoresheet');
	}
};
