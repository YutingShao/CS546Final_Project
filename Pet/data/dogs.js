const mongoCollections = require("./config/mongoCollections");
const dogs = mongoCollections.dogs;
const advertisers = mongoCollections.advertisers;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");

const CHK = require("./dataCHK/checkers.js");

async function createDog(
  advertiser,
  breed,
  name,
  age,
  address,
  description,
  vaccine,
  picture,
  postdate,
  color,
  size,
  gender
) {
  CHK.CHKstring(breed);
  CHK.CHKstring(name);
  CHK.CHKstring(age);
  CHK.CHKstring(address);
  CHK.CHKstring(description);
  CHK.CHKstring(vaccine);
  CHK.CHKstring(picture);
  CHK.CHKDate(postdate);
  CHK.CHKstring(color);
  CHK.CHKstring(size);
  CHK.CHKstring(gender);

  if (!breed) throw "Please input a valid breed.";
  if (!name) throw "Please input a valid name.";
  if (!age) throw "Please input a valid age.";
  if (!address) throw "Please input a valid address.";
  if (!description) throw "Please input a valid description.";
  if (!vaccine) throw "Please input a valid vaccine.";
  if (!picture) throw "Please input a valid picture.";
  if (!color) throw "Please input a valid color.";
  if (!size) throw "Please input a valid size.";
  if (!gender) throw "Please input a valid gender.";
  if (!postdate) throw "Please input a valid postdate.";

  const dogsCollection = await dogs();
  const advertisersCollection = await advertisers();

  let advertiserID = CHK.checkObjectId(advertiser);

  const advertiserInfo = await advertisersCollection.findOne({
    _id: advertiserID
  });

  if (advertiserInfo === null) {
    throw `There is no advertiser with ID(${advertiserID})`;
  }

  let newId = new ObjectId();
  let newDog = {
    _id: newId,
    advertiser: advertiserID,
    breed: breed,
    name: name,
    age: age,
    address: address,
    description: description,
    vaccine: vaccine,
    picture: picture,
    postdate: postdate,
    color: color,
    size: size,
    gender: gender
  };

  const insertInfo = await dogsCollection.insertOne(newDog);
  if (insertInfo.insertedCount === 0) throw "Could not add this dog.";

  return newDog;
}

// createDog(
//   "5eb9a6818fb8444674f5ea04",
//   "breed",
//   "name",
//   "age",
//   "address",
//   "description",
//   "vaccine",
//   "picture",
//   new Date(),
//   "color",
//   "size",
//   "gender"
// ).then(result => console.log(result));

async function deleteDog(id) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  const dogsCollection = await dogs();
  const ToDeleteInfo = await getById(newid);
  const deletionInfo = await dogsCollection.deleteOne({ _id: newid });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete the comment with id of ${id}`;
  }

  const usersCollection = await users();

  const updateResult = await usersCollection.update(
    {},
    {
      $pull: {
        favoriteList: id
      }
    },
    { multi: true }
  );

  return {
    deleted: true,
    data: ToDeleteInfo
  };
}

// deleteDog("5eb9ad81840584488dfd44c0").then(result => console.log(result));

async function infoUpdate(
  id,
  breed,
  name,
  age,
  address,
  description,
  vaccine,
  picture,
  postdate,
  color,
  size,
  gender
) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  CHK.CHKstring(breed);
  CHK.CHKstring(name);
  CHK.CHKstring(age);
  CHK.CHKstring(address);
  CHK.CHKstring(description);
  CHK.CHKstring(vaccine);
  CHK.CHKstring(picture);
  CHK.CHKDate(postdate);
  CHK.CHKstring(color);
  CHK.CHKstring(size);
  CHK.CHKstring(gender);

  if (!breed) throw "Please input a valid breed.";
  if (!name) throw "Please input a valid name.";
  if (!age) throw "Please input a valid age.";
  if (!address) throw "Please input a valid address.";
  if (!description) throw "Please input a valid description.";
  if (!vaccine) throw "Please input a valid vaccine.";
  if (!picture) throw "Please input a valid picture.";
  if (!color) throw "Please input a valid color.";
  if (!size) throw "Please input a valid size.";
  if (!gender) throw "Please input a valid gender.";
  if (!postdate) throw "Please input a valid postdate.";

  const dogsCollection = await dogs();

  const dog = await dogsCollection.findOne({ _id: newid });
  if (dog === null) throw "No such dog.";

  const updateResult = await dogsCollection.findOneAndUpdate(
    { _id: newid },
    {
      $set: {
        breed: breed,
        name: name,
        age: age,
        address: address,
        description: description,
        vaccine: vaccine,
        picture: picture,
        postdate: postdate,
        color: color,
        size: size,
        gender: gender
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
//   "5eb972d2e4981d39d5db8db9",
//   "breed",
//   "new anme",
//   "age",
//   "address",
//   "description",
//   "vaccine",
//   "picture",
//   new Date(),
//   "color",
//   "size",
//   "gender"
// ).then(result => console.log(result));

async function getById(id) {
  let newID = CHK.checkObjectId(id);

  const dogsCollection = await dogs();
  const dog = await dogsCollection.findOne({ _id: newID });

  if (dog === null) throw "No dog with this ID.";

  return dog;
}
// getById("5eb8f1b7c328ab2fcc332f22").then(result => console.log(result));

async function getByAdvertiserId(id) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  const advertisersCollection = await advertisers();
  const advertiser = await advertisersCollection.findOne({ _id: newid });

  if (advertiser === null) throw "No user with this ID.";

  const dogsCollection = await dogs();
  const allDogs = await dogsCollection.find({ advertiser: newid }).toArray();

  return allDogs;
}
// getByAdvertiserId("5eb8e0312af2932d3a78a96a").then(result =>
//   console.log(result)
// );

async function listAll() {
  const dogsCollection = await dogs();
  const dblist = await dogsCollection.find({}).toArray();

  return dblist;
}
// listAll().then(result => console.log(result));

async function listByBreed(breed) {
  CHK.CHKstring(breed);

  if (!breed) throw "Please input a valid breed.";

  const dogsCollection = await dogs();
  const dblist = await dogsCollection.find({ breed: breed }).toArray();

  return dblist;
}
// listByBreed("breed").then(result => console.log(result));

async function listByAge(age) {
  CHK.CHKstring(age);

  if (!age) throw "Please input a valid age.";

  const dogsCollection = await dogs();
  const dblist = await dogsCollection.find({ age: age }).toArray();

  return dblist;
}
// listByAge("age").then(result => console.log(result));

async function listByLocation(address) {
  CHK.CHKstring(address);

  if (!address) throw "Please input a valid address.";

  const dogsCollection = await dogs();
  const dblist = await dogsCollection.find({ address: address }).toArray();

  return dblist;
}
// listByLocation("address").then(result => console.log(result));

module.exports = {
  createDog,
  deleteDog,
  infoUpdate,
  getById,
  getByAdvertiserId,
  listAll,
  listByBreed,
  listByAge,
  listByLocation
};
