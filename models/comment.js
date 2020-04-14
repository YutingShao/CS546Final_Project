var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
		user_name:String,
		comment:String
	});

module.exports = mongoose.model("Comment",commentSchema);
