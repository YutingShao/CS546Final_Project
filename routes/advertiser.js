const express = require("express");
const router = express.Router();
const xss = require("xss");

const data = require("../data");

const advertisers = data.advertisers;

// const checkLogin = require("../middlewares/check").checkLogin;
// const checkCreatorsLogin = require("../middlewares/check").checkCreatorsLogin;

router.get("/", async (req, res) => {
  // res.send('Questions create Page');
  // res.json()
  res.json({ desp: "main page of the advertiser" });
  // res.render("Advertiser/advertiser_center");
});

router
  .get("/register", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    res.render("Advertiser/advertiser_register");
    // res.json({ desp: "register page of the advertiser." });
  })
  .post("/register", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    const advInfo = req.body;
    let firstName = xss(advInfo.firstName);
    let lastName = xss(advInfo.lastName);
    let email = xss(advInfo.email);
    let cellphone = xss(advInfo.cellphone);
    let address = xss(advInfo.address);
    let password = xss(advInfo.password);
    if (!firstName) {
      res
        .status(400)
        .json({ error: "Please provide the firstName." })
        .end();
      return;
    }

    if (!lastName) {
      res
        .status(400)
        .json({ error: "Please provide the lastName." })
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
    if (!cellphone) {
      res
        .status(400)
        .json({ error: "Please provide the cellphone." })
        .end();
      return;
    }
    if (!address) {
      res
        .status(400)
        .json({ error: "Please provide the address." })
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
      advertiserData = await advertisers.registar(
        firstName,
        lastName,
        email,
        cellphone,
        address,
        password
      );
      // res.json(advertiserData);
      res.redirect("/");
      // res.send({ success: true });

    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
  .get("/login", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    // res.json({ desp: "login page of the advertiser" });
    res.render("Advertiser/advertiser_login");
  })
  .post("/login", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
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
      advertiserData = await advertisers.login(email, password);
      req.session.identity = {
        id: advertiserData._id,
        identity: "advertiser"
      };
      res.redirect("/");
      // res.json(advertiserData);
      // res.send({ success: true });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router
  .get("/center", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    // res.json({ desp: "center page of the advertiser" });
    res.render("Advertiser/advertiser_center");

  })
  .put("/center", async (req, res) => {
    // res.send('Questions create Page');
    // res.json()
    const advInfo = req.body;
    let firstName = xss(advInfo.firstName);
    let lastName = xss(advInfo.lastName);
    let cellphone = xss(advInfo.cellphone);
    let address = xss(advInfo.address);
    let password = xss(advInfo.password);
    if (!firstName) {
      res
        .status(400)
        .json({ error: "Please provide the firstName." })
        .end();
      return;
    }

    if (!lastName) {
      res
        .status(400)
        .json({ error: "Please provide the lastName." })
        .end();
      return;
    }
    if (!cellphone) {
      res
        .status(400)
        .json({ error: "Please provide the cellphone." })
        .end();
      return;
    }
    if (!address) {
      res
        .status(400)
        .json({ error: "Please provide the address." })
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
      // console.log(firstName,lastName);
      advertiserData = await advertisers.infoUpdate(
        req.session.identity.id,
        firstName,
        lastName,
        cellphone,
        address,
        password
      );
      // console.log(advertiserData);
      res.redirect("/");
      // res.json(advertiserData);
      // res.send({ success: true });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

module.exports = router;
