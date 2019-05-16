let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new Schema({
	username: String,
	password: String,
	forename: String,
	surname: String,
	bjcp_id: String,
	bjcp_rank: String,
	cicerone: String,
	pro_brewer: String,
	industry: String,
	judging: String
}, { collection: 'aha-judges' }); // We use a generic 'user' in the program but store as judges

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);