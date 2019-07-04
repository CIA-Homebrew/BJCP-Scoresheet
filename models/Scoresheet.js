let mongoose = require('mongoose');
let mongoosePaginate = require("mongoose-paginate");
let Schema = mongoose.Schema;

let validators = {
	/**
	 * stringEmpty will trim and test if the string is not empty
	 * @param s
	 * @returns {boolean}
	 */
	stringEmpty : function(s) {
		// Make sure this is even a value
		if (!s) return false;
		// Make sure there is no white space
		s = s.trim();
		// Make sure it's not empty
		if (s === "") {
			return false;
		}
		// It's a good value
		return true;
	}
};

let ScoresheetSchema = new Schema({
	author: {
		type: String, //Temporary way to link scoresheet with author. Author field is user._id
	},
	session_date: {
		type: Date,
		default: Date.now
	},
	session_location: {
		type: String,
		validate: {
			validator: validators.stringEmpty,
			message: "The session location is required."
		}
	},
	category: {
		type: String,
		validate: {
			validator: validators.stringEmpty,
			message: "The category is required."
		}
	},
	sub: {
		type: String,
		validate: {
			validator: validators.stringEmpty,
			message: "The sub is required."
		}
	},
	subcategory: {
		type: String,
		validate: {
			validator: validators.stringEmpty,
			message: "The sub-category is required."
		}
	},
	special_ingredients: String,
	entry_number: {
		type: String,
		validate: {
			validator: validators.stringEmpty,
			message: "The entry number is required."
		},
		index: true,
		unique: true
	},
	flight_position: {
		type: Number,
		validate: {
			validator: validators.stringEmpty,
			message: "The flight position is required."
		}
	},
	flight_total: {
		type: Number,
		validate: {
			validator: validators.stringEmpty,
			message: "The flight total is required."
		}
	},
	mini_boss_advanced: {
		type: Boolean,
		default: false
	},
	place: Number, /** This property doesn't look used in the sheet???? **/
	consensus_score: Number,
	bottle_inspection_check: {
		type: Boolean,
		default: false
	},
	bottle_inspection_comment: String,
	aroma_score: {
		type: Number,
		default: 0
	},
	aroma_malt: String,
	aroma_malt_inappropriate: {
		type: Boolean,
		default: false
	},
	aroma_malt_comment: String,
	aroma_hops: String,
	aroma_hops_inappropriate: {
		type: Boolean,
		default: false
	},
	aroma_hops_comment: String,
	aroma_fermentation: String,
	aroma_fermentation_inappropriate: {
		type: Boolean,
		default: false
	},
	aroma_fermentation_comment: String,
	aroma_other_comment: String,
	appearance_score: {
		type: Number,
		default: 0
	},
	appearance_color: String,
	appearance_color_inappropriate: {
		type: Boolean,
		default: false
	},
	appearance_color_other: String,
	appearance_clarity: String,
	appearance_clarity_inappropriate: {
		type: Boolean,
		default: false
	},
	appearance_head: String,
	appearance_head_inappropriate: {
		type: Boolean,
		default: false
	},
	appearance_head_other: String,
	appearance_retention: String,
	appearance_retention_inappropriate: {
		type: Boolean,
		default: false
	},
	appearance_other_comment: String,
	appearance_texture_comment: String,
	descriptor_acetaldehyde: {
		type: Boolean,
		default: false
	},
	descriptor_alcoholic: {
		type: Boolean,
		default: false
	},
	descriptor_astringent: {
		type: Boolean,
		default: false
	},
	descriptor_diacetyl: {
		type: Boolean,
		default: false
	},
	descriptor_dms: {
		type: Boolean,
		default: false
	},
	descriptor_estery: {
		type: Boolean,
		default: false
	},
	descriptor_grassy: {
		type: Boolean,
		default: false
	},
	descriptor_lightstruck: {
		type: Boolean,
		default: false
	},
	descriptor_metallic: {
		type: Boolean,
		default: false
	},
	descriptor_musty: {
		type: Boolean,
		default: false
	},
	descriptor_oxidized: {
		type: Boolean,
		default: false
	},
	descriptor_phenolic: {
		type: Boolean,
		default: false
	},
	descriptor_solvent: {
		type: Boolean,
		default: false
	},
	descriptor_sour: {
		type: Boolean,
		default: false
	},
	descriptor_sulfur: {
		type: Boolean,
		default: false
	},
	descriptor_vegetal: {
		type: Boolean,
		default: false
	},
	descriptor_yeasty: {
		type: Boolean,
		default: false
	},
	flavor_score: {
		type: Number,
		default: 0
	},
	flavor_malt: String,
	flavor_malt_inappropriate: {
		type: Boolean,
		default: false
	},
	flavor_malt_comment: String,
	flavor_hops: String,
	flavor_hops_inappropriate: {
		type: Boolean,
		default: false
	},
	flavor_hops_comment: String,
	flavor_bitterness: String,
	flavor_bitterness_inappropriate: {
		type: Boolean,
		default: false
	},
	flavor_bitterness_comment: String,
	flavor_fermentation: String,
	flavor_fermentation_inappropriate: {
		type: Boolean,
		default: false
	},
	flavor_fermentation_comment: String,
	flavor_balance: String,
	flavor_balance_inappropriate: {
		type: Boolean,
		default: false
	},
	flavor_balance_comment: String,
	flavor_finish_aftertaste: String,
	flavor_finish_aftertaste_inappropriate: {
		type: Boolean,
		default: false
	},
	flavor_finish_aftertaste_comment: String,
	flavor_other_comment: String,
	mouthfeel_score: {
		type: Number,
		default: 0
	},
	mouthfeel_body: String,
	mouthfeel_body_inappropriate: {
		type: Boolean,
		default: false
	},
	mouthfeel_carbonation: String,
	mouthfeel_carbonation_inappropriate: {
		type: Boolean,
		default: false
	},
	mouthfeel_warmth: String,
	mouthfeel_warmth_inappropriate: {
		type: Boolean,
		default: false
	},
	mouthfeel_creaminess: String,
	mouthfeel_creaminess_inappropriate: {
		type: Boolean,
		default: false
	},
	mouthfeel_astringency: String,
	mouthfeel_astringency_inappropriate: {
		type: Boolean,
		default: false
	},
	mouthfeel_other_comment: String,
	overall_score: {
		type: Number,
		default: 0
	},
	overall_class_example: String,
	overall_flawless: String,
	overall_wonderful: String,
	feedback_comment: String,
	judge_total: {
		type: Number,
		default: 0
	},

	//Set to true after confirming submit scoresheet
	scoresheet_submitted: {
		type: Boolean,
		default: false
	}

}, { 
	timestamps: true, 			// Enable createdat and updatedat timestamp fields
	collection: 'aha-scoresheets' 
});

ScoresheetSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Scoresheet', ScoresheetSchema);