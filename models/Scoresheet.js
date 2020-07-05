'use strict';

/**
 * stringEmpty will trim and test if the string is not empty
 * @param s
 * @param msg
 * @returns {boolean}
 */
function stringEmpty(s, msg) {
	// Make sure this is even a value
	if (!s) return false;
	// Make sure there is no white space
	s = s.trim();
	// Make sure it's not empty
	if (s === "") {
		throw new Error(msg);
	}
	// It's a good value
	return true;
}

module.exports = (sequelize, DataTypes) => {
	const Scoresheet = sequelize.define('Scoresheet', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			autoIncrement: false,
			isUUID: {
				msg: 'Improperly formatter ID provided.'
			}
		},
		session_date: {
			type: DataTypes.DATE,
			default: DataTypes.NOW
		},
		session_location: {
			type: DataTypes.STRING,
			allowNull: true,		// We do this to utilize our own validation routine
			validate: {
				isEmpty: stringEmpty(this.session_location, "The session location is required.")
			}
		},
		category: {
			type: DataTypes.STRING,
			allowNull: true,		// We do this to utilize our own validation routine
			validate: {
				isEmpty: stringEmpty(this.category, "The category is required.")
			}
		},
		sub: {
			type: DataTypes.STRING,
			allowNull: true,		// We do this to utilize our own validation routine
			validate: {
				isEmpty: stringEmpty(this.sub, "The sub is required.")
			}
		},
		subcategory: {
			type: DataTypes.STRING,
			allowNull: true,		// We do this to utilize our own validation routine
			validate: {
				isEmpty: stringEmpty(this.subcategory, "The sub-category is required.")
			}
		},
		special_ingredients: DataTypes.STRING,
		entry_number: {
			type: DataTypes.STRING,
			allowNull: true,		// We do this to utilize our own validation routine
			validate: {
				isEmpty: stringEmpty(this.entry_number, "The entry number is required.")
			},
			index: true,
			unique: true
		},
		flight_position: {
			type: DataTypes.NUMBER,
			allowNull: true,		// We do this to utilize our own validation routine
			validate: {
				isEmpty: stringEmpty(this.flight_position, "The flight position is required.")
			}
		},
		flight_total: {
			type: DataTypes.NUMBER,
			allowNull: true,		// We do this to utilize our own validation routine
			validate: {
				isEmpty: stringEmpty(this.flight_total, "The flight total is required.")
			}
		},
		mini_boss_advanced: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		place: DataTypes.NUMBER, /** This property doesn't look used in the sheet???? **/
		consensus_score: DataTypes.NUMBER,
		bottle_inspection_check: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		bottle_inspection_comment: DataTypes.STRING,
		aroma_score: {
			type: DataTypes.NUMBER,
			default: 0
		},
		aroma_malt: DataTypes.STRING,
		aroma_malt_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		aroma_malt_comment: DataTypes.STRING,
		aroma_hops: DataTypes.STRING,
		aroma_hops_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		aroma_hops_comment: DataTypes.STRING,
		aroma_fermentation: DataTypes.STRING,
		aroma_fermentation_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		aroma_fermentation_comment: DataTypes.STRING,
		aroma_other_comment: DataTypes.STRING,
		appearance_score: {
			type: DataTypes.NUMBER,
			default: 0
		},
		appearance_color: DataTypes.STRING,
		appearance_color_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		appearance_color_other: DataTypes.STRING,
		appearance_clarity: DataTypes.STRING,
		appearance_clarity_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		appearance_head: DataTypes.STRING,
		appearance_head_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		appearance_head_other: DataTypes.STRING,
		appearance_retention: DataTypes.STRING,
		appearance_retention_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		appearance_other_comment: DataTypes.STRING,
		appearance_texture_comment: DataTypes.STRING,
		descriptor_acetaldehyde: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_alcoholic: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_astringent: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_diacetyl: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_dms: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_estery: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_grassy: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_lightstruck: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_metallic: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_musty: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_oxidized: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_phenolic: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_solvent: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_sour: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_sulfur: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_vegetal: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		descriptor_yeasty: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		flavor_score: {
			type: DataTypes.NUMBER,
			default: 0
		},
		flavor_malt: DataTypes.STRING,
		flavor_malt_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		flavor_malt_comment: DataTypes.STRING,
		flavor_hops: DataTypes.STRING,
		flavor_hops_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		flavor_hops_comment: DataTypes.STRING,
		flavor_bitterness: DataTypes.STRING,
		flavor_bitterness_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		flavor_bitterness_comment: DataTypes.STRING,
		flavor_fermentation: DataTypes.STRING,
		flavor_fermentation_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		flavor_fermentation_comment: DataTypes.STRING,
		flavor_balance: DataTypes.STRING,
		flavor_balance_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		flavor_balance_comment: DataTypes.STRING,
		flavor_finish_aftertaste: DataTypes.STRING,
		flavor_finish_aftertaste_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		flavor_finish_aftertaste_comment: DataTypes.STRING,
		flavor_other_comment: DataTypes.STRING,
		mouthfeel_score: {
			type: DataTypes.NUMBER,
			default: 0
		},
		mouthfeel_body: DataTypes.STRING,
		mouthfeel_body_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		mouthfeel_carbonation: DataTypes.STRING,
		mouthfeel_carbonation_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		mouthfeel_warmth: DataTypes.STRING,
		mouthfeel_warmth_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		mouthfeel_creaminess: DataTypes.STRING,
		mouthfeel_creaminess_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		mouthfeel_astringency: DataTypes.STRING,
		mouthfeel_astringency_inappropriate: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		mouthfeel_other_comment: DataTypes.STRING,
		overall_score: {
			type: DataTypes.NUMBER,
			default: 0
		},
		overall_class_example: DataTypes.STRING,
		overall_flawless: DataTypes.STRING,
		overall_wonderful: DataTypes.STRING,
		feedback_comment: DataTypes.STRING,
		judge_total: {
			type: DataTypes.NUMBER,
			default: 0
		},
		//Set to true after confirming submit scoresheet
		scoresheet_submitted: {
			type: DataTypes.BOOLEAN,
			default: false
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: true,
		},
		judge_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		judge_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		judge_email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		judge_bjcp_id: DataTypes.STRING,
		judge_bjcp_rank: DataTypes.STRING,
		judge_cicerone_rank: DataTypes.STRING,
		judge_pro_brewer_brewery: DataTypes.STRING,
		judge_industry_description: DataTypes.STRING,
		judge_judging_years: DataTypes.STRING,
	}, {
	});

	Scoresheet.createOrUpdate = function(options) {
		return Scoresheet
			.findOne(options)
			.then((sheet) => {
				if (!sheet) {
					// If we don't have a sheet then build one but strip the ID to be safe
					delete options.values.id;
					sheet = Scoresheet.build(options.values);
					return sheet.save(options);
				} else {
					// If we have a sheet just update the values and return it
					return sheet.update(options.values, options)
				}
			})
			.catch(err => {
				return new Error(err);
			});
	};

	Scoresheet.associate = function (models) {
		// associations can be defined here
		Scoresheet.belongsTo(models.User, {foreignKey: "id", as: "userID"});
	};

	return Scoresheet;
};