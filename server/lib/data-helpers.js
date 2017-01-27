"use strict";
// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const ObjectId = require('mongodb').ObjectId;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, app) {
  return {

    findTweet : (resolve, reject, tweetId) => {
      db.collection("tweets").find({_id : ObjectId(tweetId)}).toArray((err, tweets) => {
        resolve(tweets);
      });
    },

    kissTweet : function(resolve, reject, tweetObj, userId){
      if (tweetObj[0].likes.hasOwnProperty(userId)) {
        //remove
        delete tweetObj[0].likes[userId];
      } else {
        // add
        tweetObj[0].likes[userId] = true;
      };
      db.collection("tweets")
        .updateOne({_id : ObjectId(tweetObj[0]._id)}, {$set: {likes : tweetObj[0].likes}}
        ,((err) => {  resolve("Done!"); }))
    },

    register: function (user, callback) {
      db.collection("user").insertOne(user, (err) => {
        if (err) {
          return callback(err);
        }
        callback(null, true);
      });
    },

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
