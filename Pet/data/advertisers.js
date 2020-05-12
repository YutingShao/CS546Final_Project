const mongoCollections = require("./config/mongoCollections");
const advertisers = mongoCollections.advertisers;
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const { ObjectId } = require("mongodb");
const CHK = require("./dataCHK/checkers.js");

async function registar(
  firstName,
  lastName,
  email,
  cellphone,
  address,
  password
) {
  CHK.CHKstring(firstName);
  CHK.CHKstring(lastName);
  CHK.CHKstring(email);
  CHK.CHKstring(cellphone);
  CHK.CHKstring(address);
  CHK.CHKstring(password);

  if (!firstName) throw "Please provide a valid user first name.";
  if (!lastName) throw "Please provide a valid user last name.";
  if (!email) throw "Please provide a valid email.";
  if (!cellphone) throw "Please provide a valid cellphone.";
  if (!address) throw "Please provide a valid address.";
  if (!password) throw "Please provide a valid password.";

  const advertisersCollection = await advertisers();
  const user = await advertisersCollection.findOne({
    email: email.toLowerCase()
  });
  if (user !== null) throw "Sorry. This Advertiser has existed.";

  CHK.CHKPWType(password);

  const hashedPassWord = await bcrypt.hash(password, saltRounds);

  let newId = new ObjectId();

  let newAdvertiser = {
    _id: newId,
    firstName: firstName,
    lastName: lastName,
    email: email.toLowerCase(),
    cellphone: cellphone,
    address: address,
    password: hashedPassWord
  };

  const insertInfo = await advertisersCollection.insertOne(newAdvertiser);
  if (insertInfo.insertedCount === 0) throw "Could not add user";

  return newAdvertiser;
}

// registar("1", "1", "124@adf.com", "cellphone", "address", "Password1").then(
//   result => console.log(result)
// );

async function login(email, password) {
  CHK.CHKstring(email);
  CHK.CHKstring(password);

  if (!email) throw "Please provide a valid email.";
  if (!password) throw "Please provide a valid password.";

  const advertisersCollection = await advertisers();

  const advertiser = await advertisersCollection.findOne({
    email: email.toLowerCase()
  });
  if (advertiser === null) throw "Please make sure your email.";

  CHK.CHKPWType(password);

  let cmp_password = await bcrypt.compare(password, advertiser.password);
  if (cmp_password === true) {
    return advertiser;
  } else {
    throw `Please make sure your password.`;
  }
}
// login("124@adf.com", "Password1").then(result => console.log(result));

async function infoUpdate(
  id,
  firstName,
  lastName,
  cellphone,
  address,
  password
) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  CHK.CHKstring(firstName);
  CHK.CHKstring(lastName);
  CHK.CHKstring(cellphone);
  CHK.CHKstring(address);
  CHK.CHKstring(password);

  if (!firstName) throw "Please provide a valid user name.";
  if (!lastName) throw "Please provide a valid user name.";
  if (!cellphone) throw "Please provide a valid cellphone.";
  if (!address) throw "Please provide a valid address.";
  if (!password) throw "Please provide a valid password.";

  const advertisersCollection = await advertisers();

  const advertiser = await advertisersCollection.findOne({ _id: newid });
  if (advertiser === null) throw "No such advertiser.";

  CHK.CHKPWType(password);
  const hashedPassWord = await bcrypt.hash(password, saltRounds);

  const updateResult = await advertisersCollection.findOneAndUpdate(
    { _id: newid },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        cellphone: cellphone,
        address: address,
        password: hashedPassWord
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
//   "5eb9a6818fb8444674f5ea04",
//   "firstName",
//   "lastName",
//   "cellphone",
//   "address",
//   "Password2"
// ).then(result => console.log(result));

async function getById(id) {
  let newid = CHK.checkObjectId(id);

  const advertisersCollection = await advertisers();

  const advertiser = await advertisersCollection.findOne({ _id: newid });
  if (advertiser === null) throw "No advertiser with this ID.";

  return advertiser;
}
// getById("5cb765e4291d400f38c1e08d").then(result => console.log(result));

async function listAll() {
  const advertisersCollection = await advertisers();
  const dblist = await advertisersCollection.find({}).toArray();

  return dblist;
}

module.exports = {
  registar,
  login,
  infoUpdate,
  getById,
  listAll
};
