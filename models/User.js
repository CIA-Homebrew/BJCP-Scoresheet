let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');
require('mongoose-type-email');

let UserSchema = new Schema({
	username: {
		type: [mongoose.SchemaTypes.Email, ""],
		require: [true, "Email address is missing."],
		unique: true,
		validate: {
			validator: function(v) {
				return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
			},
			message: props => "Invalid email address provided."
		}
	},
	password: {
		type: String,
		require: [true, "Password is missing."]
	},
	forename: {
		type: String,
		require: [true, "First name is missing or invalid."],
		validate: {
			validator: function(v) {
				return v.trim() !== "";
			},
			message: props => "A first name is required."
		}
	},
	surname: {
		type: String,
		require: [true, "Last name is missing or invalid."],
		validate: {
			validator: function(v) {
				return v.trim() !== "";
			},
			message: props => "A last name is required."
		}
	},
	bjcp_id: {
		type: String,
		require: true
	},
	bjcp_rank: {
		type: String,
		require: false
	},
	cicerone_rank: {
		type: String,
		require: false
	},
	pro_brewer_brewery: {
		type: String,
		require: false
	},
	industry_description: {
		type: String,
		require: false
	},
	judging_years: {
		type: String,
		require: false
	},
	user_level: {
		type: Number,
		require: true,
		default: 0 // 0 = judge/basic user; 1 = head judge; 2 = admin
	}
}, { collection: 'aha-judges' }); // We use a generic 'user' in the program but store as judges

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);