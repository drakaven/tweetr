"use strict";
// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, app) {
  return {

    login: function (user,callback){
      db.collection("user").find({'name' : user})
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
