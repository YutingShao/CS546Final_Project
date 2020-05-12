const { ObjectId } = require("mongodb");

function CHKstring(val) {
  if (typeof val !== "string") {
    throw `the input should be a string`;
  }
}

function CHKInt(val) {
  if (!Number.isInteger(val)) {
    throw `the input should be an integer`;
  }
}

function CHKDate(val) {
  if (!(val instanceof Date)) {
    throw `the input should be Date Type`;
  }
}

function checkObjectId(id) {
  if (!(id instanceof ObjectId)) {
    try {
      if (typeof id === "undefined") throw "Specifed Id is undefined";
      id = ObjectId(id);
    } catch (e) {
      throw "Unable to parse ObjectId";
    }
  }
  return id;
}

function CHKarray(val) {
  if (Array.isArray(val) === false) {
    throw `Hi, Router maker you miss input the array info. Make sure you modify the body to the required format.`;
  } else {
    if (val.length === 0) {
      throw `There should be at least one option.`;
    }
    return val;
  }
}

function CHKStrInfo(val) {
  if (val === null || val === undefined) {
    throw `Please make sure your option is not empty.`;
  } else {
    let str = val;
    if (str.replace(/\s/g, "").length === 0) {
      throw `Please make sure your option is valid.`;
    } else {
      return val;
    }
  }
}

// function RandomN(arr, num) {
//   // Math.floor(Math.random() * (arr.length) );
//   let cnt = 0;
//   let index = [];
//   let NewArr = [];
//   while (cnt < num) {
//     // console.log(cnt, num)
//     let temp = Math.floor(Math.random() * arr.length);
//     if (index.includes(temp) === false) {
//       index.push(temp);
//       NewArr.push(arr[temp]);
//       cnt = cnt + 1;
//       //console.log(index, NewArr, temp, cnt)
//     }
//   }
//   return NewArr;
// }
// // RandomN([3,5,2,6,8,4,10], 3)

function CHKPWType(str) {
  // Math.floor(Math.random() * (arr.length) );
  let lenReq = str.length >= 6 && str.length <= 12;
  let numReq = str.match(/[0-9]/g) !== null;
  let letter1Req = str.match(/[a-z]/g) !== null;
  let letter2Req = str.match(/[A-Z]/g) !== null;
  let SpaceReq = str.match(/[ \s ]/g) === null;
  let otherReq = str.match(/[0-9a-zA-Z]/g).length === str.length;
  // console.log(str.match(/[0-9a-zA-Z]/g).length)
  // console.log(str.length)
  if (lenReq && numReq && letter1Req && letter2Req && SpaceReq && otherReq) {
    return str;
  }
  throw `Your password length should be 6-12 including and only including uppercase letter, lowercase letter and number.`;
}
// console.log(CHKPWType("wH1wH1wH1wH1wH1"))

module.exports = {
  CHKstring,
  CHKInt,
  checkObjectId,
  CHKarray,
  CHKStrInfo,
  CHKPWType,
  CHKDate
};
