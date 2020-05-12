// const HomeRoutes = require("./homepage");
const UserRoutes = require("./user");
const AdvertiserRoutes = require("./advertiser");
const DogRoutes = require("./dog");
const AdminRoutes = require("./admin");
// const logoutRoutes = require("./logout");

const constructorMethod = app => {
  // app.use("/BhowBhow", HomeRoutes);
  app.use("/BhowBhowUser", UserRoutes);
  app.use("/BhowBhowAdveritser", AdvertiserRoutes);

  app.use("/BhowBhowAdmin", AdminRoutes);

  // app.use("/logout", logoutRoutes);



  app.use("/dog",DogRoutes);

  app.use("*", (req, res) => {
    // res.json({ error: "Something wrong!" });
    res.render("404");
    // if (!req.session.user) {
    //   res.redirect("/BhowBhow");
    // } else if (req.session.user.identity === "user") {
    //   res.redirect("/BhowBhowUser");
    // } else if (req.session.user.identity === "advertiser") {
    //   res.redirect("/BhowBhowAdveritser");
    // } else if (req.session.user.identity === "admin") {
    //   res.redirect("/BhowBhowAdmin");
    // }
  });
};

module.exports = constructorMethod;
