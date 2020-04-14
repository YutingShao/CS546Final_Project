var mongoose = require("mongoose");

var dogSchema = new mongoose.Schema({
	dog_breed:String,
	dog_name:String,
	dog_age:String,
	dog_address:String,
	dog_description:String,
	dog_vaccine:[],
	dog_picture:String,
	dog_postdate:String,
	dog_color:String,
	dog_size:String,
	dog_gender:String,
	comments:[{
		type:mongoose.Schema.Type.ObjectID,
		ref:"Comment"
	}]
});

module.exports = mongoose.model("Dog",dogSchema);
