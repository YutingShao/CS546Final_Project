const express = require("express");
const router = express.Router();

const data = require("../data");
const candidates = data.candidates;
const creators = data.creators;
const quizzes = data.quizzes;
const xss = require("xss");

const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get("/",checkNotLogin, async (req, res) => {
    // console.log('Register Page');
    res.render('mainpage/homepage',{
        title: "home page",
        HOMEPAGE_CSS: true
    });
});

router.post("/register", async (req, res) => {
    // console.log('Register Page');
    // console.log("register POST SUCCESS")
    // console.log(req.body)

    const RegisterInfo = req.body;
    const name = xss(RegisterInfo.username);
    const password = xss(RegisterInfo.password);
    const identity = xss(RegisterInfo.userID);
    //check the register infomation
    if(!RegisterInfo){
      res.status(400).json({ error: "Please make sure no empty input." }).end();
      return;
    }
    if(!name){
        res.status(400).json({ error: "Please provide a username." }).end();
        return;
    }
    if(!password){
        res.status(400).json({ error: "Please provide a password" }).end();
        return;
    }
    if(!identity){
        res.status(400).json({ error: "Please select an identity." }).end();
        return;
    }
    if(password !== RegisterInfo.confirm_password){
        res.status(400).json({ error: "Please confirm your password."}).end();
        return;
    }

    //put the new user to database, return a json{}
    try{
        // console.log(identity)
          if(identity == 'candidate')
          {
              const newCandidate = await candidates.registar(name,password);
            //   res.json(newCandidate);
          }else if(identity == 'creator'){
              const newCreator = await creators.registar(name,password);
            //   res.json(nekwCreator);
          }else{
              throw 'Please select an identity.';
          }
        //   res.redirect("/login")
        //   res.redirect("/register")
        res.send({ success: true })
    }catch(e){
        res.status(500).json({ error: e });
    }
});

router.post("/login", async (req, res) => {
    // console.log('Register Page');
     //get the register infomation(name,password,identity) frome request
    const loginInfo = req.body;
    const name = xss(loginInfo.username);
    const password = xss(loginInfo.password);
    const identity = xss(loginInfo.userID);
    let userdata;

    //check the register infomation  
    if(!loginInfo){
        res.status(400).json({ error: "Please make sure no empty input." }).end();
        return;
    }
    if(!name){
        res.status(400).json({ error: "Please provide your username." }).end();
        return;
    }
    if(!password){
        res.status(400).json({ error: "Please provide your password." }).end();
        return;
    }
    if(!identity){
        res.status(400).json({ error: "Please select your identity." }).end();
        return;
    }

    try{
        if(identity == 'candidate')
        {
            userdata = await candidates.login(name,password);
        }else if(identity == 'creator'){
            userdata = await creators.login(name,password);
        }else{
            throw 'Please select your identity.';
        }
        req.session.user = {
            username : userdata.name,
            identity : identity,
            userId   : userdata._id
        };
        /* Session {
                cookie:
                { path: '/',
                  _expires: 2019-05-11T14:05:45.077Z,
                  originalMaxAge: 600000,
                  httpOnly: true },
                user:
                { username: 'userTest1',
                  identity: 'creator',
                  userId: 5cd6cf5eb7f2461f8f68233b } } */

    res.send({ success: true })

    }catch(e){
        res.status(500).json({ error: e });
    }
});


router.post("/accountUpdate",async (req, res) => {
    //get the Update infomation(name,OldPassword,NewPassword,identity) frome request
    const longinInfo = req.body;
    // console.log(longinInfo)
    // const name = longinInfo.username;


    const OldPassword = xss(longinInfo.OldPassword);
    const NewPassword = xss(longinInfo.NewPassword);
    const identity = req.session.user.identity;

    // const identity = longinInfo.identity;
    let userId = req.session.user.userId;
    let userdata;
    
    //check the  infomation  
    if(!longinInfo){
      res.status(400).json({ error: "Please make sure no empty input." }).end();
      return;
    }
    // if(!name){
    //   res.status(400).json({ error: "You must provide a name" }).end();
    //   return;
    // }
    if(!OldPassword){
      res.status(400).json({ error: "Please provide your old password." }).end();
      return;
    }
    if(!NewPassword){
      res.status(400).json({ error: "Please provide your new password." }).end();
      return;
    }
    // if(!identity){
    //   res.status(400).json({ error: "You must provide a Identity" }).end();
    //   return;
    // }
    
    try{
      if(identity == 'candidate')
      {
          userdata = await candidates.infoUpdate(userId,OldPassword,NewPassword);
          res.send({ success: true })
        //   res.json(userdata);
      }else if(identity == 'creator'){
          userdata = await creators.infoUpdate(userId,OldPassword,NewPassword);
          res.send({ success: true })
        //   res.json(userdata);
      }else{
          throw 'identity data error';
      } 
    }catch(e){
        res.status(500).json({ error: e });
    }
  
});



router.post("/takeQuiz", async (req, res) => {
    const quizzeInfo = req.body;
    let field = xss(quizzeInfo.field);
    // console.log(req.body)
    // const quizzeInfo = {field: "computer"};
    // let field = "computer";
    // let candidatesId = req.session.userId;
    let candidatesId = req.session.user.userId;
    let identity = req.session.user.identity;

    let quizData;

    try{
        // console.log(candidatesId, field)
        quizData = await quizzes.genQuiz(candidatesId,field);
        // console.log(quizData.Questions[0]);
        let Ques_id = [];
        for(let i=0;i<quizData.Questions.length;i=i+1){
            Ques_id.push(quizData.Questions[i]._id)
        }
        // console.log(Ques_id)
        req.session.Q_id = quizData.Q_id;
        req.session.Ques_id = Ques_id;
        // console.log(identity)
        if(identity == "candidate"){
            res.render("Quiz/takeQuiz", {
                Questions: quizData.Questions,
                Creator_path_CSS: true,
                candidate_type: true,
                title: "takeQuiz"
            });
        }else if(identity == "creator"){
            res.render("Quiz/takeQuiz", {
                Questions: quizData.Questions,
                Creator_path_CSS: true,
                creator_type: true,
                title: "takeQuiz"
            });
        }

        

    }catch(e){
        // console.log("Here we are")
        if(identity === 'candidate'){
            req.session.errors = e.toString()
            // console.log(req.session.errors, "error pass IN")
            res.redirect('/QuizMeCandidate/startQuiz')
        }else if(identity === 'creator'){
            req.session.errors = e.toString()
            res.redirect('/QuizMeCreator/startQuiz')
        }
        // res.status(500).json({ error: e });
    }
    
    
});

router.post("/QuizSubmit", async (req, res) => {

    const answerInfo = req.body;
    if(!Array.isArray(answerInfo.Submission)){
        let a1 = [];
        a1[0] = answerInfo.Submission;
        answerInfo.Submission = a1;
    }
    // console.log(answerInfo)
    const identity = req.session.user.identity;
    let quizId = req.session.Q_id;
    let Sub_ANS = answerInfo.Submission;
    req.session.Ques_id
    let Submission = [];
    for(let i=0;i< req.session.Ques_id.length;i=i+1){
        let temp = {
            QuesId:req.session.Ques_id[i],
            answer:[Sub_ANS[i]]
        }
        Submission.push(temp)
    }

    // console.log(Submission)
    let quizData;

    try{
        quizData = await quizzes.grade(quizId,Submission);
        req.session.Ques_id = undefined;
        req.session.Q_id = undefined;
        // console.log(quizData)
        req.session.quizData = quizData;
        // console.log(req.session.quizData)

        if(identity === 'candidate'){
            res.redirect('/QuizMeCandidate/QuizScore');
        }else if(identity === 'creator'){
            res.redirect('/QuizMeCreator/QuizScore');
        }
        // res.json(quizData);
    }catch(e){
      res.status(500).json({ error: e });
    }
    
    
});

module.exports = router;