var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
		user_name:String,
		user_password:String,
		user_email:String,
		user_gender:String,
		user_address:String,
		user_age:String,
		favoriteList:[]
	});

module.exports = mongoose.model("User",userSchema);
