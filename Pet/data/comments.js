const mongoCollections = require("./config/mongoCollections");
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const dogs = mongoCollections.dogs;
const { ObjectId } = require("mongodb");
const CHK = require("./dataCHK/checkers.js");

async function createComment(user, dog, comment) {
  CHK.CHKstring(comment);

  if (!comment) throw "Please input a valid comment.";

  const dogsCollection = await dogs();
  const usersCollection = await users();
  const commentsCollection = await comments();

  let userID = CHK.checkObjectId(user);
  let dogID = CHK.checkObjectId(dog);

  const userInfo = await usersCollection.findOne({
    _id: userID
  });
  const dogInfo = await dogsCollection.findOne({
    _id: dogID
  });
  if (userInfo === null) {
    throw `There is no user with ID(${userID})`;
  }
  if (dogInfo === null) {
    throw `There is no dog with ID(${dogID})`;
  }

  let newId = new ObjectId();
  let newComment = {
    _id: newId,
    userID: userID,
    dogID: dogID,
    comment: comment
  };

  const insertInfo = await commentsCollection.insertOne(newComment);
  if (insertInfo.insertedCount === 0) throw "Could not add this comment.";

  return newComment;
}
// createComment(
//   "5eb8dc1fd71b382cb636c978",
//   "5eb8f1b7c328ab2fcc332f21",
//   "new comment"
// ).then(result => console.log(result));

async function deleteComment(id) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  const commentsCollection = await comments();
  const ToDeleteInfo = await getById(newid);
  const deletionInfo = await commentsCollection.deleteOne({ _id: newid });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete the comment with id of ${id}`;
  }

  return {
    deleted: true,
    data: ToDeleteInfo
  };
}
// deleteComment("5eb96f9c0588133965c75444").then(result => console.log(result));

async function infoUpdate(id, comment) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  CHK.CHKstring(comment);

  if (!comment) throw "Please provide a valid comment.";

  const commentsCollection = await comments();

  const oneComment = await commentsCollection.findOne({ _id: newid });
  if (oneComment === null) throw "No such comment.";

  const updateResult = await commentsCollection.findOneAndUpdate(
    { _id: newid },
    {
      $set: {
        comment: comment
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
//   "5eb8dc1fd71b382cb636c978",
//   "5eb8f1b7c328ab2fcc332f21",
//   "new comment"
// ).then(result => console.log(result));

async function getById(id) {
  let newid = CHK.checkObjectId(id);

  const commentsCollection = await comments();

  const comment = await commentsCollection.findOne({ _id: newid });
  if (comment === null) throw "No comment with this ID.";

  return comment;
}
// getById("5eb96f9c0588133965c7544e").then(result => console.log(result));

async function getByDogId(id) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  const dogsCollection = await dogs();
  const dog = await dogsCollection.findOne({ _id: newid });

  if (dog === null) throw "No dog with this ID.";

  const commentsCollection = await comments();
  const allComments = await commentsCollection.find({ dogID: newid }).toArray();

  return allComments;
}
// getByDogId("5eb972d2e4981d39d5db8db9").then(result => console.log(result));

async function getByUserId(id) {
  let newid = CHK.checkObjectId(id);
  if (!newid) throw "You must provide an id to search for";

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: newid });

  if (user === null) throw "No user with this ID.";

  const commentsCollection = await comments();
  const allComments = await commentsCollection
    .find({ userID: newid })
    .toArray();

  return allComments;
}
// getByUserId("5eb972d2e4981d39d5db8db9").then(result => console.log(result));

async function listAll() {
  const commentsCollection = await comments();
  const dblist = await commentsCollection.find({}).toArray();

  return dblist;
}

module.exports = {
  createComment,
  deleteComment,
  infoUpdate,
  getById,
  getByDogId,
  getByUserId,
  listAll
};
