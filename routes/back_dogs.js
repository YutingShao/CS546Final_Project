var express = require("express");
var router = express.Router();
var Dog = require("../models/dog.js");
var request = require("request");

router.get("/",function(req,res)){
	dogs.find({},function(err,allDogs){
		if(err)
			console.log(err);
		else
			res.render("index",{dogs:allDogs});
	})
}

router.post("/",function(req,res){
	var breed = req.body.breed;
	var name = req.body.name;
	var age = req.body.age;
	var address = req.body.address;
	var desc = req.body.desc;
	var vaccine = req.body.vaccine;
	var image = req.body.image;
	var postdate = req.body.postdate;
	var color = req.body.color;
	var size = req.body.size;
	var gender = req.body.gender;
	var age = req.body.age;

	var newDog = {
			dog_breed:breed,
			dog_name:name,
			dog_age:age,
			dog_address:address,
			dog_description:desc,
			dog_vaccine:vaccine,
			dog_picture:image,
			dog_postdate:postdate,
			dog_color:color,
			dog_size:size,
			dog_gender:gender
	};
	Dog.create(newDog,function(err,newlycreated)){
		if(err)
			console.log(err);
		else
			res.redirect("/dogs");
	}

});

router.get("/new",function(req,res){
	res.render("new_dog");
});

router.get("/:id",function(req,res){
	Dog.findById(req.params.id).populate("comments").exec(function(err,foundDog){
		if(err)
			console.log(err);
		else{
			res.render("dogs/dog_page",{dog:foundDog});
		}
	});
});