const express = require("express");
const router = express.Router();

// const checkLogin = require("../middlewares/check").checkLogin;
// const checkCreatorsLogin = require("../middlewares/check").checkCreatorsLogin;

const data = require("../data");
const questions = data.questions;
const quizzes = data.quizzes;
const xss = require("xss");
const admin = data.admin;

// checkCreatorsLogin,
router.get("/",  async (req, res) => {
  // res.send('Questions create Page');
  // res.json()
  // res.render("mainpage/mainCreator", {
  //   title: "Creator Main Page",
  //   Creator_main_CSS: true
  // });
  // res.render("Admin/admin");
  res.json({ desp: "main page of the admin" });
});

router.get("/showAdvertisers",async (req,res)=>{
      res.send("advertiser table");
      // const advertisers = admin.getAllAdvertisers();
  // res.render("Admin/admin_advertiser_table",{advertisers:advertisers});
});

router.get("/showUsers",async (req,res) =>{
  res.send("user table");
  // const users = admin.getAllUsers();
  // res.render("Admin/admin_dogs_table",{users:users});
})
router.get("/showComments",async(req,res)=>{
  res.send("Comment table");
  // const comments = admin.getAllComments();
  // res.render("Admin/admin_comments");
})

router.put("/userupdate",async (req,res) => {
    const advInfo = req.body;
    
    let password = xss(advInfo.password);
    let email = xss(advInfo.email);

    if (!password) {
      res
        .status(400)
        .json({ error: "Please provide the password." })
        .end();
      return;
    }
    if (!email) {
      res
        .status(400)
        .json({ error: "Please provide the email." })
        .end();
      return;
    }

    try{
        //   var id = ;
      // userData = await admin.updateUser(email,password);
      
      // req.session.identity = {
      //   id: userData._id,
      //   identity: "uesr"
      // };
      res.json(userData);
      res.send({ success: true });
    }catch(e){
      res.status(500).json({ error: e });
    }
});

router
  .get("/login", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    res.json({ desp: "login page of the admin" });
    // res.render("Advertiser/advertiser_login");
  })
  .post("/login", async (req, res) => {
    // res.send('Questions create Page');
    // res.json();
    const advInfo = req.body;
    console.log(advInfo);
    let email = xss(advInfo.email);
    let password = xss(advInfo.password);
    // login(email, password);
    if (!email) {
      res
        .status(400)
        .json({ error: "Please provide the email." })
        .end();
      return;
    }

    if (!password) {
      res
        .status(400)
        .json({ error: "Please provide the password." })
        .end();
      return;
    }

    try {
      admin = await admin.login(email, password);
      // req.session.identity = {
      //   id: advertiserData._id,
      //   identity: "advertiser"
      // };
      // res.redirect("/");
      res.json(admin);
      // res.send({ success: true });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });
// router.delete("/deleteUser/:id",async(req,res) => {
  
//   try{
//     var deleteUser = await admin.deleteUserByID(req.params.id);
//     console.log(deleteUser);
//   }catch(e){
//     console.log(e);
//     res.json(e);
//   }

// });

router
  .get("/center", async (req, res) => {
    res.send(' center Page');
    // res.json()
    // res.json({ desp: "center page of the advertiser" });
    // res.render("Admin/admin");

  });



















////////////////////////////////relating to the creator to create a Question////////////////////////////
router.get("/createQuestion", async (req, res) => {
  // res.send('Questions create Page');
  // res.render("Question/createQues", {
  //   title: "CreateQuestion",
  //   Creator_path_CSS: true
  // });
});

router.get("/searchQuestion",  async (req, res) => {
  // res.send('Questions create Page');
  res.render("Question/searchQues", {
    title: "SearchQuestion",
    Creator_search_CSS: true
  });
});

router.get("/startQuiz",  async (req, res) => {
  // res.send('Questions create Page');
  let e = req.session.errors;
  req.session.errors = undefined;
  res.render("Question/tryQuiz", {
    title: "StartQuiz",
    Creator_search_CSS: true,
    error: e,
    creator_type: true
  });
});

router.get("/accountUpdate",  async (req, res) => {
  // res.send('Questions create Page');
  res.render("mainpage/accountupdate", {
    title: "Account Update",
    HOMEPAGE_AU_CSS: true,
    identity: "Creator",
    creator_type: true
  });
});

router.get("/QuizScore",  async (req, res) => {
  // res.send('Questions create Page');
  let quizInfo = req.session.quizData;
  let quizName = quizInfo.quizName;
  let quizScore = quizInfo.quizScore;

  req.session.quizData = undefined;

  res.render("Quiz/QuizResult", {
    title: "Quiz Result",
    Name: quizName,
    Score: quizScore,
    Show_score: true,
    creator_type: true
  });
});

router.get("/QuizHistory", async (req, res) => {
  // res.send('Questions create Page');
  let candidatesId = req.session.user.userId;
  let quizzesData;

  try {
    quizzesData = await quizzes.getAllQuiz(candidatesId);
    res.render("Quiz/QuizHistory", {
      title: "Quiz History",
      history: quizzesData,
      Show_score: true,
      creator_type: true
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Check the question is created by the current creator
async function checkCurrent(req, res, next) {
  const Quesresult = await questions.getById(req.params.id);
  if (!req.session.user) {
    res.redirect("/QuizMe");
    return;
  } else if (req.session.user.userId != Quesresult.creator) {
    res.redirect("/QuizMe");
    return;
  }
  next();
}

router.get("/modifyQues/:id", async (req, res) => {
  const Quesresult = await questions.getById(req.params.id);
  req.session.QuesModify = Quesresult;

  res.render("Question/modifyQues", {
    title: "Update Question",
    Ques: Quesresult,
    modify_question: true
  });
});

router.get("/deleteQues/:id",  async (req, res) => {
  // console.log(req.params.id)

  const Quesresult = await questions.getById(req.params.id);

  req.session.Quesdelete = Quesresult;

  // console.log(Quesresult)
  res.render("Question/deleteQues", {
    title: "Delete Question",
    Ques: Quesresult,
    modify_question: true
  });
});

router.post("/createQuestion", async (req, res) => {
  //get the question infomation frome request
  // console.log(req.body)
  const questionInfo = req.body;
  // let creatorId = req.session.userId;
  let creatorId = req.session.user.userId;
  let content = xss(questionInfo.Ques_content);
  let answers = [];
  let options = [];
  let op_arr = questionInfo.op;
  let option_arr = questionInfo.option;
  // console.log(option_arr[op_arr])
  answers.push(xss(option_arr[op_arr]));
  // console.log(answers);
  option_arr.splice(op_arr, 1);
  for (let i = 0; i < option_arr.length; i++) {
    if (xss(option_arr[i]) !== "") {
      options.push(xss(option_arr[i]));
    }
  }

  if (!content) {
    res
      .status(400)
      .json({ error: "Please provide the content." })
      .end();
    return;
  }

  if (options.length + answers.length < 4) {
    res
      .status(400)
      .json({ error: "Please make sure no empty option." })
      .end();
    return;
  }

  if (answers[0] === "") {
    res
      .status(400)
      .json({ error: "Please select an answer." })
      .end();
    return;
  }

  if (!answers) {
    res
      .status(400)
      .json({ error: "Please select an answer." })
      .end();
    return;
  }
  if (!options) {
    res
      .status(400)
      .json({ error: "Please provide your options." })
      .end();
    return;
  }

  for (let i = 0; i < options.length; i = i + 1) {
    if (answers[0] === options[i]) {
      res
        .status(400)
        .json({ error: "Please make sure no duplicate option." })
        .end();
      return;
    }
  }

  for (let i = 0; i < options.length; i = i + 1) {
    for (let j = i + 1; j < options.length; j = j + 1)
      if (options[i] === options[j]) {
        res
          .status(400)
          .json({ error: "Please make sure no duplicate option." })
          .end();
        return;
      }
  }

  if (!Array.isArray(answers)) {
    let a1 = [];
    a1[0] = answers;
    answers = a1;
  }
  if (!Array.isArray(options)) {
    let a2 = [];
    a2[0] = options;
    options = a2;
  }

  try {
    questionData = await questions.createQuestion(
      creatorId,
      content,
      answers,
      options
    );
    // res.json(questionData);
    res.send({ success: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/SearchResult", async (req, res) => {
  // let creatorId = req.session.userId;
  let creatorId = req.session.user.userId;
  const ViewInfo = req.body;
  const field = xss(ViewInfo.field);
  let questionData;
  // /searchQuestion

  // if(!ViewInfo){
  //     res.status(400).json({ error: "You must provide Effective Input" }).end();
  //     return;
  //   }
  //   if(!field){
  //       res.status(400).json({ error: "You must provide a field" }).end();
  //       return;
  //   }

  try {
    questionData = await questions.SearchByField(creatorId, field);
    // res.json(questionData);
    // console.log(questionData);
    res.render("Question/listQues", {
      title: "Question List",
      result: questionData,
      Show_score: true
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

// /QuizMeCreator/modifyQues

router.post("/modifyQues", async (req, res) => {
  // console.log(req.body)
  // return res.send(req.body);
  //get the question infomation frome request
  const newQuestionInfo = req.body;
  // console.log(newQuestionInfo)
  let questionId = req.session.QuesModify._id;
  let content = newQuestionInfo.Ques_content;
  let answers = [];
  // // newQuestionInfo.op;
  let options = [];
  // newQuestionInfo.option;
  // let questionData;

  let temp_option = [];
  temp_option.push(xss(newQuestionInfo.option[1]));
  temp_option.push(xss(newQuestionInfo.option[2]));
  temp_option.push(xss(newQuestionInfo.option[3]));
  temp_option.push(xss(newQuestionInfo.option[0]));

  answers.push(temp_option[xss(newQuestionInfo.op)]);

  temp_option.splice(xss(newQuestionInfo.op), 1);
  options = temp_option;

  //  console.log(answers, options)

  if (answers.length + options.length !== 4 || xss(newQuestionInfo.op) === "") {
    res
      .status(400)
      .json({ error: "Please make sure there is empty and duplicate option." })
      .end();
    return;
  }

  if (!questionId) {
    res
      .status(400)
      .json({ error: "Please provide Effective questionId" })
      .end();
    return;
  }
  if (!content) {
    res
      .status(400)
      .json({ error: "Please provide the content." })
      .end();
    return;
  }
  if (!answers) {
    res
      .status(400)
      .json({ error: "Please select an answer." })
      .end();
    return;
  }
  if (!options) {
    res
      .status(400)
      .json({ error: "Please provide options." })
      .end();
    return;
  }

  for (let i = 0; i < options.length; i = i + 1) {
    if (answers[0] === options[i]) {
      res
        .status(400)
        .json({ error: "Please make sure no duplicate option." })
        .end();
      return;
    }
  }

  for (let i = 0; i < options.length; i = i + 1) {
    for (let j = i + 1; j < options.length; j = j + 1)
      if (options[i] === options[j]) {
        res
          .status(400)
          .json({ error: "Please make sure no duplicate option." })
          .end();
        return;
      }
  }

  if (!Array.isArray(answers)) {
    let a1 = [];
    a1[0] = answers;
    answers = a1;
  }
  if (!Array.isArray(options)) {
    let a2 = [];
    a2[0] = options;
    options = a2;
  }

  try {
    options = options.filter(function(el) {
      return answers.indexOf(el) < 0;
    });

    questionData = await questions.updateQuestion(
      questionId,
      content,
      answers,
      options
    );
    // console.log(questionData)
    //clean session
    req.session.QuesModify = undefined;
    // res.json(questionData);
    res.send({ success: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/deleteQues", async (req, res) => {
  const questionInfo = req.body;
  const questionId = xss(questionInfo.questionId);
  let deleteInfo;

  try {
    deleteInfo = await questions.deleteQuestion(req.session.Quesdelete._id);
    //clean session
    req.session.Quesdelete = undefined;

    res.send({ success: true });
    //   res.json(deleteInfo);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
