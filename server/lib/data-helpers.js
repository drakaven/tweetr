"use strict";
// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, app) {
  return {
    register: function (user, callback) {
     console.log("registerPost");
      db.collection("user").insertOne(user);
      callback(null, true);
    },

    getAuthor : function(loginID, callback){
       db.collection("user").find({"name" : loginID}).toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    },

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        db.collection("tweets").insertOne(newTweet, (err, result) => {
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
