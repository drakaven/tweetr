"use strict";
// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const ObjectId = require('mongodb').ObjectId;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, app) {
  return {

    //find a tweet by object id
    findTweet : (resolve, reject, tweetId) => {
      db.collection("tweets").find({_id : ObjectId(tweetId)}).toArray((err, tweets) => {
        if (err) {
          return reject(err);
        }
        resolve(tweets);
      });
    },

    //given a tweet object and user find if the userid is in the like collection
    //if they exists remove them, if they do not add them
    kissTweet : function(resolve, reject, tweetObj, userId){
      if (tweetObj[0].likes.hasOwnProperty(userId)) {
        //remove
        delete tweetObj[0].likes[userId];
      } else {
        // add
        tweetObj[0].likes[userId] = true;
      };
      //update tweet
      db.collection("tweets")
        .updateOne({_id : ObjectId(tweetObj[0]._id)}, {$set: {likes : tweetObj[0].likes}}
        ,((err) => {
            if (err) {
              return reject(err);
            }
        resolve("Done!"); }))
    },

    //insert into user collection
    register: function (user, callback) {
      db.collection("user").insertOne(user, (err) => {
        if (err) {
          return callback(err);
        }
        callback(null, true);
      });
    },

    //check for user in user collection
    getLogin : function(loginID, callback){
       db.collection("user").find({"name" : loginID}).toArray((err, userInfo) => {
        if (err) {
          return callback(err);
        }
        callback(null, userInfo);
      });
    },

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        db.collection("tweets").insertOne(newTweet, (err, result) => {
          if (err) {
            return callback(err);
          }
          callback(null, true);
        });
      });
    },

    //get all tweets
    getTweets: function getTweets(callback) {
      db.collection("tweets").find().sort({"created_at": -1}).toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    }
  };
};
