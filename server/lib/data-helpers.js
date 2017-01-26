"use strict";
const cookieSession = require('cookie-session');


// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, app) {
  return {
    register: function (user, callback) {
     console.log("registerPost");
      db.collection("user").insertOne(user);
      cookieSession.loginID = user.loginID;
      callback(null, true);
    },
    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        db.collection("tweets").insertOne(newTweet, (err, result) => {
          //the tweet value is ops not just result;
          //we are not actually inteterested in a single return :(
          //res.json(result.ops)
          callback(null, true);
        });
      });
    },

    // Get all tweets in `db`, sorted by newest first
    // this need to be made a callback of saveTweet otherwise it misses a tweet
    getTweets: function getTweets(callback) {
      db.collection("tweets").find().sort({"created_at": -1}).toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    }

  };
}
