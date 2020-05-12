const mongoCollections = require("./config/mongoCollections");
const users = mongoCollections.users;
const dogs = mongoCollections.dogs;
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const { ObjectId } = require("mongodb");
const CHK = require("./dataCHK/checkers.js");

async function registar(name, password, email, gender, city, state, age) {
  CHK.CHKstring(name);
  CHK.CHKstring(password);
  CHK.CHKstring(email);
  CHK.CHKstring(gender);
  CHK.CHKstring(city);
  CHK.CHKstring(state);
  CHK.CHKInt(age);

  if (!name) throw "Please provide a valid user name.";
  if (!password) throw "Please provide a valid password.";
  if (!email) throw "Please provide a valid email.";
  if (!gender) throw "Please provide a valid gender.";
  if (!city) throw "Please provide a valid city.";
  if (!state) throw "Please provide a valid state.";
  if (!age) throw "Please provide a valid age.";

  const usersCollection = await users();
  const user = await usersCollection.findOne({ email: email.toLowerCase() });
  if (user !== null) throw "Sorry. This email is used.";

  CHK.CHKPWType(password);

  const hashedPassWord = await bcrypt.hash(password, saltRounds);

  let newId = new ObjectId();

  let newUser = {
    _id: newId,
    name: name,
    password: hashedPassWord,
    email: email.toLowerCase(),
    gender: gender,
    city: city.toUpperCase(),
    state: state.toUpperCase(),
    age: age,
    favoriteList: []
  };

  const insertInfo = await usersCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user";

  return newUser;
}
// registar(
//   "1234",
//   "Yuting2019",
//   "Yuting@gmail.com",
//   "Female",
//   "state",
//   "country",
//   18
// ).then(result => console.log(result));

async function login(email, password) {
  CHK.CHKstring(email);
  CHK.CHKstring(password);

  if (!email) throw "Please provide a valid email.";
  if (!password) throw "Please provide a valid password.";

  const usersCollection = await users();

  const user = await usersCollection.findOne({ email: email.toLowerCase() });
  if (user === null) throw "Please make sure your email.";

  CHK.CHKPWType(password);

  let cmp_password = await bcrypt.compare(password, user.password);
  if (cmp_password === true) {
    return user;
  } else {
    throw `Please make sure your password.`;
  }
}
// login("123@aasdf.com", "WHYwhy2").then(result => console.log(result));

async function infoUpdate(id, name, password, gender, city, state, age) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  CHK.CHKstring(name);
  CHK.CHKstring(password);
  CHK.CHKstring(gender);
  CHK.CHKstring(city);
  CHK.CHKstring(state);
  CHK.CHKInt(age);

  if (!name) throw "Please provide a valid user name.";
  if (!password) throw "Please provide a valid password.";
  if (!gender) throw "Please provide a valid gender.";
  if (!city) throw "Please provide a valid city.";
  if (!state) throw "Please provide a valid state.";
  if (!age) throw "Please provide a valid age.";

  const usersCollection = await users();

  const user = await usersCollection.findOne({ _id: newid });
  if (user === null) throw "No such user.";

  CHK.CHKPWType(password);
  const hashedPassWord = await bcrypt.hash(password, saltRounds);

  const updateResult = await usersCollection.findOneAndUpdate(
    { _id: newid },
    {
      $set: {
        name: name,
        password: hashedPassWord,
        gender: gender,
        city: city.toUpperCase(),
        state: state.toUpperCase(),
        age: age
      }
    },
    { returnOriginal: false }
  );
  if (!updateResult.ok) {
    throw `Mongo was unable to update the user: ${newid}`;
  }

  return await getById(id);
}
// infoUpdate(
//   "5eb9661696384138643e6eee",
//   "WHYwhy1",
//   "WHYwhy2",
//   "male",
//   "city",
//   "state",
//   123
// ).then(result => console.log(result));

async function getById(id) {
  let newid = CHK.checkObjectId(id);

  const usersCollection = await users();

  const user = await usersCollection.findOne({ _id: newid });
  if (user === null) throw "No user with this ID.";

  return user;
}
// getById("5eb8dc1fd71b382cb636c978").then(result => console.log(result));

async function likeDogById(userID, dogID) {
  let newUserID = CHK.checkObjectId(userID);
  let newDogID = CHK.checkObjectId(dogID);

  const dogsCollection = await dogs();

  const dog = await dogsCollection.findOne({ _id: newDogID });
  if (dog === null) throw "No dog with this ID.";

  const userCollection = await users();

  const userInfo = await getById(userID);

  if (userInfo.favoriteList.includes(dogID)) throw "This dog has been liked.";

  const updateResult = await userCollection.findOneAndUpdate(
    { _id: newUserID },
    {
      $push: { favoriteList: dogID }
    },
    { returnOriginal: false }
  );

  if (!updateResult.ok) {
    throw `Mongo was unable to add the dog(${DogID}) to list of ${newUserID}`;
  }

  return await getById(userID);
}
// likeDogById("5eb8dc1fd71b382cb636c978", "5eb9ad81840584488dfd44c0").then(
//   result => console.log(result)
// );

async function dislikeDogById(userID, dogID) {
  let newUserID = CHK.checkObjectId(userID);
  let newDogID = CHK.checkObjectId(dogID);

  const dogsCollection = await dogs();

  const dog = await dogsCollection.findOne({ _id: newDogID });
  if (dog === null) throw "No dog with this ID.";

  const userCollection = await users();

  const userInfo = await getById(userID);

  if (!userInfo.favoriteList.includes(dogID))
    throw "This dog has NOT been liked.";

  const updateResult = await userCollection.findOneAndUpdate(
    { _id: newUserID },
    {
      $pull: { favoriteList: dogID }
    },
    { returnOriginal: false }
  );

  if (!updateResult.ok) {
    throw `Mongo was unable to add the dog(${DogID}) to list of ${newUserID}`;
  }

  return await getById(userID);
}

// dislikeDogById("5eb8dc1fd71b382cb636c978", "5eb972d2e4981d39d5db8db9").then(
//   result => console.log(result)
// );

async function listAll() {
  const usersCollection = await users();
  const dblist = await usersCollection.find({}).toArray();

  return dblist;
}

module.exports = {
  registar,
  login,
  infoUpdate,
  getById,
  likeDogById,
  dislikeDogById,
  listAll
};
