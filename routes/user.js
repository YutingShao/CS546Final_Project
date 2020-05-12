const express = require("express");
const router = express.Router();
const xss = require("xss");

const users = require("../data/users");

// const users = data.users;
// const comments = data.comments;


// const checkLogin = require("../middlewares/check").checkLogin;
// const checkCreatorsLogin = require("../middlewares/check").checkCreatorsLogin;

router.get("/", async (req, res) => {
  // res.send('Questions create Page');
  // res.json()
  res.json({ desp: "main page of the user" });
});

router
  .get("/register", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    // res.json({ desp: "register page of the user." });
    res.render("Users/user_register")
  })
  .post("/register", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    const advInfo = req.body;
    // registar(name, password, email, gender, city, state, age)

    let name = xss(advInfo.name);
    let password = xss(advInfo.password);
    let email = xss(advInfo.email);
    let gender = xss(advInfo.gender);
    let city = xss(advInfo.city);
    let state = xss(advInfo.state);
    let age;
    if (/^\d+$/.test(xss(advInfo.age))) {
      age = parseInt(xss(advInfo.age));
    } else {
      res
        .status(400)
        .json({ error: "Please provide an integer." })
        .end();
      return;
    }

    if (!name) {
      res
        .status(400)
        .json({ error: "Please provide the name." })
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
    if (!email) {
      res
        .status(400)
        .json({ error: "Please provide the email." })
        .end();
      return;
    }
    if (!gender) {
      res
        .status(400)
        .json({ error: "Please provide the gender." })
        .end();
      return;
    }
    if (!city) {
      res
        .status(400)
        .json({ error: "Please provide the city." })
        .end();
      return;
    }
    if (!state) {
      res
        .status(400)
        .json({ error: "Please provide the state." })
        .end();
      return;
    }
    // console.log(name, password, email, gender, city, state, age);
    try {
      console.log(name, password, email, gender, city, state, age);
      userData = await users.registar(
        name,
        password,
        email,
        gender,
        city,
        state,
        age
      );
      console.log(userData);
      res.json(userData);
      res.send({ success: true });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
  .get("/login", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    // res.json({ desp: "login page of the user" });
    res.render("Users/user_login")
  })
  .post("/login", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    const advInfo = req.body;
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
      userData = await users.login(email, password);
      console.log(userData);
      req.session.identity = {
        id: userData._id,
        identity: "uesr"
      };
      res.json(userData);
      res.send({ success: true });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
  .get("/center", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    // res.json({ desp: "center page of the user" });
    res.render("Users/user_center");
  })
  .put("/center", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    const advInfo = req.body;
    let name = xss(advInfo.name);
    let gender = xss(advInfo.gender);
    let city = xss(advInfo.city);
    let state = xss(advInfo.state);
    let password = xss(advInfo.password);
    if (!name) {
      res
        .status(400)
        .json({ error: "Please provide your name." })
        .end();
      return;
    }

    if (!gender) {
      res
        .status(400)
        .json({ error: "Please provide the gender." })
        .end();
      return;
    }
    if (!city) {
      res
        .status(400)
        .json({ error: "Please provide the city." })
        .end();
      return;
    }
    if (!state) {
      res
        .status(400)
        .json({ error: "Please provide the state." })
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
      usersData = await users.infoUpdate(
        req.session.identity.id,
        name, password, gender, city, state, age);
      res.redirect("/");
      // res.json(usersData);
      // res.send({ success: true });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

module.exports = router;
