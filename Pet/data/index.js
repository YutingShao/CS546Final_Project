const advertiserData = require("./advertisers");
const commentData = require("./comments");
const dogData = require("./dogs");
const userData = require("./comments");
const adminData = require("./admins");

module.exports = {
  advertisers: advertiserData,
  comments: commentData,
  dogs: dogData,
  users: userData,
  admin: adminData
};
