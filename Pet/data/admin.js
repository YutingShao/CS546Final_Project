const mongoCollections = require("./config/mongoCollections");
const dogFuncs = require("./dogs");
const commentFuncs = require("./comments");
const userFuncs = require("./users");
const advertiserFuncs = require("./advertisers");
const admins = mongoCollections.admins;
const dogs = mongoCollections.dogs;
const advertisers = mongoCollections.advertisers;
const users = mongoCollections.users;
const comments = mongoCollections.comments;

const bcrypt = require("bcryptjs");
const saltRounds = 16;
const { ObjectId } = require("mongodb");
const CHK = require("./dataCHK/checkers.js");

async function registar(name, password) {
  CHK.CHKstring(name);
  CHK.CHKstring(password);

  if (!name) throw "Please provide a valid user name.";
  if (!password) throw "Please provide a valid password.";

  // const advertisersCollection = await advertisers();

  const adminsCollection = await admins();

  const admin = await adminsCollection.findOne({ name: name });
  if (admin !== null) throw "Sorry. This name is used.";

  CHK.CHKPWType(password);

  const hashedPassWord = await bcrypt.hash(password, saltRounds);

  let newId = new ObjectId();

  let newUser = {
    _id: newId,
    name: name,
    password: hashedPassWord
  };

  const insertInfo = await adminsCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add admin";

  return newUser;
}
// registar("124@adf.com", "Password1").then(result => console.log(result));

async function login(name, password) {
  CHK.CHKstring(name);
  CHK.CHKstring(password);

  if (!name) throw "Please provide a valid name.";
  if (!password) throw "Please provide a valid password.";

  const adminCollection = await admins();

  const admin = await adminCollection.findOne({
    name: name
  });
  if (admin === null) throw "Please make sure your name.";

  CHK.CHKPWType(password);

  let cmp_password = await bcrypt.compare(password, admin.password);
  if (cmp_password === true) {
    return admin;
  } else {
    throw `Please make sure your password.`;
  }
}
// login("124@adf.com", "Password1").then(result => console.log(result));

async function getAllUsers() {
  return await userFuncs.listAll();
}
// getAllUsers().then(result => console.log(result));

async function getAllAdvertisers() {
  return await advertiserFuncs.listAll();
}
// getAllAdvertisers().then(result => console.log(result));

async function getAllDogs() {
  return await dogFuncs.listAll();
}
// getAllDogs().then(result => console.log(result));

async function getAllComments() {
  return await commentFuncs.listAll();
}
// getAllComments().then(result => console.log(result));

async function deleteDogByID(id) {
  const deletedInfo = await dogFuncs.deleteDog(id);
  return deletedInfo;
}
// deleteDogByID("5eb9c13681ba964f56fa5333").then(result => console.log(result));

async function deleteUserByID(id) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  const usersCollection = await users();
  const ToDeleteInfo = await userFuncs.getById(newid);
  const deletionInfo = await usersCollection.deleteOne({ _id: newid });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete the user with id of ${id}`;
  }

  return {
    deleted: true,
    data: ToDeleteInfo
  };
}
// deleteUserByID("5eb8dc1fd71b382cb636c978").then(result => console.log(result));

async function deleteCommentByID(id) {
  const deletedInfo = await commentFuncs.deleteComment(id);
  return deletedInfo;
}
// deleteCommentByID("5eb96fa36a08bd396a2d808c").then(result =>
//   console.log(result)
// );

async function deleteAdvertiserByID(id) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  const advertisersCollection = await advertisers();
  const ToDeleteInfo = await advertiserFuncs.getById(newid);
  const deletionInfo = await advertisersCollection.deleteOne({ _id: newid });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete the user with id of ${id}`;
  }

  const dogsCollection = await dogs();
  await dogsCollection.deleteMany({ advertiser: newid });

  return {
    deleted: true,
    data: ToDeleteInfo
  };
}
// deleteAdvertiserByID("5eb8e0418aa4c42d412e9f32").then(result =>
//   console.log(result)
// );

async function updateUser(id, email, password) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  CHK.CHKstring(email);
  CHK.CHKstring(password);

  if (!email) throw "Please provide a valid user email.";
  if (!password) throw "Please provide a valid user password.";

  const usersCollection = await users();

  const user = await usersCollection.findOne({ _id: newid });
  if (user === null) throw "No such user.";

  CHK.CHKPWType(password);
  const hashedPassWord = await bcrypt.hash(password, saltRounds);

  const updateResult = await usersCollection.findOneAndUpdate(
    { _id: newid },
    {
      $set: {
        email: email,
        password: hashedPassWord
      }
    },
    { returnOriginal: false }
  );
  if (!updateResult.ok) {
    throw `Mongo was unable to update the user: ${newid}`;
  }
  return await userFuncs.getById(id);
}
// updateUser("5eb9661696384138643e6eea", "12313", "Adfafw12").then(result =>
//   console.log(result)
// );

async function updateAdvertiser(id, email, password) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  CHK.CHKstring(email);
  CHK.CHKstring(password);

  if (!email) throw "Please provide a valid user email.";
  if (!password) throw "Please provide a valid user password.";

  const advertisersCollection = await advertisers();

  const user = await advertisersCollection.findOne({ _id: newid });
  if (user === null) throw "No such advertiser.";

  CHK.CHKPWType(password);
  const hashedPassWord = await bcrypt.hash(password, saltRounds);

  const updateResult = await advertisersCollection.findOneAndUpdate(
    { _id: newid },
    {
      $set: {
        email: email,
        password: hashedPassWord
      }
    },
    { returnOriginal: false }
  );
  if (!updateResult.ok) {
    throw `Mongo was unable to update the user: ${newid}`;
  }
  return await advertiserFuncs.getById(id);
}
// updateAdvertiser("5eb9a6818fb8444674f5ea04", "312341234", "adfafwA1").then(
//   result => console.log(result)
// );

module.exports = {
  registar,
  login,
  getAllUsers,
  getAllAdvertisers,
  getAllDogs,
  getAllComments,
  deleteDogByID,
  deleteUserByID,
  deleteCommentByID,
  deleteAdvertiserByID,
  updateUser,
  updateAdvertiser
};
