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
	category: {
		type: String,
		validate: validators.stringEmpty
	},
	sub: {
		type: String,
		validate: validators.stringEmpty
	},
	subcategory: {
		type: String,
		validate: validators.stringEmpty
	},
	special_ingredients: String,
	entry_number: {
		type: String,
		validate: validators.stringEmpty
	},
	flight_position: {
		type: Number,
		validate: validators.stringEmpty
	},
	flight_total: {
		type: Number,
		validate: validators.stringEmpty
	},
	mini_boss_advanced: {
		type: Boolean,
		default: false
	},
	place: Number, /** This property doesn't look used in the sheet???? **/
	consensus_score: String,
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
	aroma_malt_inappropriate: Boolean,
	aroma_malt_comment: String,
	aroma_hops: String,
	aroma_hops_inappropriate: Boolean,
	aroma_hops_comment: String,
	aroma_fermentation: String,
	aroma_fermentation_inappropriate: Boolean,
	aroma_fermentation_comment: String,
	aroma_other_comment: String,
	appearance_score: String,
	appearance_color: String,
	appearance_color_inappropriate: Boolean,
	appearance_color_other: String,
	appearance_clarity: String,
	appearance_clarity_inappropriate: Boolean,
	appearance_head: String,
	appearance_head_inappropriate: Boolean,
	appearance_head_other: String,
	appearance_retention: String,
	appearance_retention_inappropriate: Boolean,
	appearance_other_comment: String,
	appearance_texture_comment: String,
	descriptor_acetaldehyde: Boolean,
	descriptor_alcoholic: Boolean,
	descriptor_astringent: Boolean,
	descriptor_diacetyl: Boolean,
	descriptor_dms: Boolean,
	descriptor_estery: Boolean,
	descriptor_grassy: Boolean,
	descriptor_lightstruck: Boolean,
	descriptor_metallic: Boolean,
	descriptor_musty: Boolean,
	descriptor_oxidized: Boolean,
	descriptor_phenolic: Boolean,
	descriptor_solvent: Boolean,
	descriptor_sour: Boolean,
	descriptor_sulfur: Boolean,
	descriptor_vegetal: Boolean,
	descriptor_yeasty: Boolean,
	flavor_score: String,
	flavor_malt: String,
	flavor_malt_inappropriate: Boolean,
	flavor_malt_comment: String,
	flavor_hops: String,
	flavor_hops_inappropriate: Boolean,
	flavor_hops_comment: String,
	flavor_bitterness: String,
	flavor_bitterness_inappropriate: Boolean,
	flavor_bitterness_comment: String,
	flavor_fermentation: String,
	flavor_fermentation_inappropriate: Boolean,
	flavor_fermentation_comment: String,
	flavor_balance: String,
	flavor_balance_inappropriate: Boolean,
	flavor_balance_comment: String,
	flavor_finish_aftertaste: String,
	flavor_finish_aftertaste_inappropriate: Boolean,
	flavor_finish_aftertaste_comment: String,
	flavor_other_comment: String,
	mouthfeel_score: String,
	mouthfeel_body: String,
	mouthfeel_body_inappropriate: Boolean,
	mouthfeel_carbonation: String,
	mouthfeel_carbonation_inappropriate: Boolean,
	mouthfeel_warmth: String,
	mouthfeel_warmth_inappropriate: Boolean,
	mouthfeel_creaminess: String,
	mouthfeel_creaminess_inappropriate: Boolean,
	mouthfeel_astringency: String,
	mouthfeel_astringency_inappropriate: Boolean,
	mouthfeel_other_comment: String,
	overall_score: String,
	overall_class_example: String,
	overall_flawless: String,
	overall_wonderful: String,
	feedback_comment: String,
	judge_total: String
}, { 
	timestamps: true, 			// Enable createdat and updatedat timestamp fields
	collection: 'aha-scoresheets' 
});

ScoresheetSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Scoresheet', ScoresheetSchema);