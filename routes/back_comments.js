var express = require("express");
var router = express.Router();
var Dog = require("../models/dog.js");
var Comment = require("../models/comment.js");


router.get("/new",function(req,res) {
	Dog.findById(req.params.id,function(err,foundDog){
		if(err)
			console.log(err);
		else
			res.render("comment/new_comment",{dog:foundDog});
	})
})


router.post("/",function(req,res){
	Dog.findById(req.params.id,function(err,foundDog){
		if(err)
			console.log(err);
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					console.log(err);
				else
					{
				foundDog.comments.push(comment);
				foundDog.save();
				res.redirect("/dog/" + foundDog._id);
					}	
			});
		}		
	})
});

