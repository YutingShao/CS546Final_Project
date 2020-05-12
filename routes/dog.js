const express = require("express");
const router = express.Router();

// const checkLogin = require("../middlewares/check").checkLogin;
// const checkCandidatesLogin = require("../middlewares/check")
//   .checkCandidatesLogin;

// const data = require("../data");
// const questions = data.questions;
// const quizzes = data.quizzes;
// const xss = require("xss");

router.get("/listdogs", async (req, res) => {
  // res.send('Questions create Page');
  // res.json()
  res.render({ desp: "center page of the advertiser" });
});

router
  .get("/adddog", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    res.render({ desp: "center page of the advertiser" });
  })
  .post("/adddog", async (req, res) => {

    //-------------------------------
    var newDog = req.body;
    var breed =  newDog.breed;
    var name = newDog.name;
    var age = newDog.age;
    var address = newDog.address;
    var description = newDog.description;
    var vaccine = newDog.vaccine;
    var picture = newDog.picture;
    var postdate = newDog.postdate;
    var color = newDog.color;
    var size = newDog.size;
    var gender = newDog.gender;
    var advertiser = req.params.id;
    try{
        Dog.createDog(advertiser,breed,name,age,address,description,vaccine,picture,postdate,color,size, gender);
    }catch(e){
        res.status(404).json({ message: "not found!" });
    }

    //-------------------------------
    // res.send('Questions create Page');
    // res.json()
    res.render({ desp: "center page of the advertiser" });
  });


//  --------------------------------
router.get("/quiz",function(req,res){
    res.render("Mainpage/dog-quiz");                 // dog quiz
});
router.get("/search",function(req,res){
    res.render("Search/dog-search");                   //search engine
});

router.post("/search",async function(req,res) {
    var keyword = req.body.keyword.toLowerCase();
    if(req.body.search === "breed")
    {  
      const dogs = await Dog.listByBreed(keyword);       
      res.render("Search/dog-search-result",{ dogs:dogs   });       //findby breed
    }
    else if(req.body.search === "location"){
        const dogs = await Dog.listByLocation(keyword);    
        res.render("Search/dog-search-result",{  dogs:dogs    });
    }else if(req.body.search === "age"){
        const dogs = await Dog.listByAge(keyword);    
        res.render("Search/dog-search-result",{  dogs:dogs  });
    }
});

router.get("/breeds",async function(req,res){
    res.render("Mainpage/dog-breeds");
});
router.get("/nutrition",async function(req,res){
  // res.render("Mainpage/");
    res.render("FeedingGuide/dog-nutrition");
});
router.get("/problems",async function(req,res){
    res.render("FeedingGuide/dog-problems")
});


// router.get("/:id",function (req,res){
//     try {
//         const dog =  Dog.getById(req.params.id);
//         res.render("dogPage",{
//             breed: dog.breed,
//             name: dog.name,
//             age: dog.age,
//             address: dog.address,
//             description: dog.description,
//             vaccine: dog.vaccine,
//             picture: dog.picture,
//             postdate: dog.postdate,
//             color: dog.color,
//             size: dog.size,
//             gender: dog.gender
//         });
//     }catch(e){
//         res.status(404).json({ message: "not found!" });
//     }
// });
// router.post("/",function(req,res){
    

// });

router.put("/",function(req,res){
    try {
        const dog = Dog.getById(req.params.id);
        Dog.infoUpdate(  req.params.id,
            req.body.breed,req.body.name,req.body.age,req.body.address,
            req.body.description,req.body.vaccine,req.body.picture,
            req.body.postdate,req.body.color,req.body.size,
            req.body.gender);
            
        res.render("dogPage",{
            breed: dog.breed,
            name: dog.name,
            age: dog.age,
            address: dog.address,
            description: dog.description,
            vaccine: dog.vaccine,
            picture: dog.picture,
            postdate: dog.postdate,
            color: dog.color,
            size: dog.size,
            gender: dog.gender
        });
    }catch(e){
        res.status(404).json({ message: "not found!" });
    }
});

module.exports = router;
