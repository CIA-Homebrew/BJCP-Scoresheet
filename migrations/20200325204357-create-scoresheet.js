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
			special_ingredients: Sequelize.STRING,
			entry_number: {
				type: Sequelize.STRING,
				allowNull: true,
				index: true,
				unique: true
			},
			flight_position: {
				type: Sequelize.NUMBER,
				allowNull: true
			},
			flight_total: {
				type: Sequelize.NUMBER,
				allowNull: true
			},
			mini_boss_advanced: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			place: Sequelize.NUMBER,
			consensus_score: Sequelize.NUMBER,
			bottle_inspection_check: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			bottle_inspection_comment: Sequelize.STRING,
			aroma_score: {
				type: Sequelize.NUMBER,
				default: 0
			},
			aroma_malt: Sequelize.STRING,
			aroma_malt_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			aroma_malt_comment: Sequelize.STRING,
			aroma_hops: Sequelize.STRING,
			aroma_hops_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			aroma_hops_comment: Sequelize.STRING,
			aroma_fermentation: Sequelize.STRING,
			aroma_fermentation_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			aroma_fermentation_comment: Sequelize.STRING,
			aroma_other_comment: Sequelize.STRING,
			appearance_score: {
				type: Sequelize.NUMBER,
				default: 0
			},
			appearance_color: Sequelize.STRING,
			appearance_color_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			appearance_color_other: Sequelize.STRING,
			appearance_clarity: Sequelize.STRING,
			appearance_clarity_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			appearance_head: Sequelize.STRING,
			appearance_head_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			appearance_head_other: Sequelize.STRING,
			appearance_retention: Sequelize.STRING,
			appearance_retention_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			appearance_other_comment: Sequelize.STRING,
			appearance_texture_comment: Sequelize.STRING,
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
				type: Sequelize.NUMBER,
				default: 0
			},
			flavor_malt: Sequelize.STRING,
			flavor_malt_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_malt_comment: Sequelize.STRING,
			flavor_hops: Sequelize.STRING,
			flavor_hops_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_hops_comment: Sequelize.STRING,
			flavor_bitterness: Sequelize.STRING,
			flavor_bitterness_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_bitterness_comment: Sequelize.STRING,
			flavor_fermentation: Sequelize.STRING,
			flavor_fermentation_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_fermentation_comment: Sequelize.STRING,
			flavor_balance: Sequelize.STRING,
			flavor_balance_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_balance_comment: Sequelize.STRING,
			flavor_finish_aftertaste: Sequelize.STRING,
			flavor_finish_aftertaste_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			flavor_finish_aftertaste_comment: Sequelize.STRING,
			flavor_other_comment: Sequelize.STRING,
			mouthfeel_score: {
				type: Sequelize.NUMBER,
				default: 0
			},
			mouthfeel_body: Sequelize.STRING,
			mouthfeel_body_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_carbonation: Sequelize.STRING,
			mouthfeel_carbonation_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_warmth: Sequelize.STRING,
			mouthfeel_warmth_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_creaminess: Sequelize.STRING,
			mouthfeel_creaminess_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_astringency: Sequelize.STRING,
			mouthfeel_astringency_inappropriate: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			mouthfeel_other_comment: Sequelize.STRING,
			overall_score: {
				type: Sequelize.NUMBER,
				default: 0
			},
			overall_class_example: Sequelize.STRING,
			overall_flawless: Sequelize.STRING,
			overall_wonderful: Sequelize.STRING,
			feedback_comment: Sequelize.STRING,
			judge_total: {
				type: Sequelize.NUMBER,
				default: 0
			},
			scoresheet_submitted: {
				type: Sequelize.BOOLEAN,
				default: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			userId: {
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
				type: Sequelize.STRING,
				allowNull: true
			},
			judge_name: {
				type: Sequelize.STRING,
				allowNull: true
			},
			judge_email: {
				type: Sequelize.STRING,
				allowNull: true
			},
			judge_bjcp_id: Sequelize.STRING,
			judge_bjcp_rank: Sequelize.STRING,
			judge_cicerone_rank: Sequelize.STRING,
			judge_pro_brewer_brewery: Sequelize.STRING,
			judge_industry_description: Sequelize.STRING,
			judge_judging_years: Sequelize.STRING,
		});
	},

	down: (queryInterface, Sequelize) => {
		  return queryInterface.dropTable('scoresheet');
	}
};
