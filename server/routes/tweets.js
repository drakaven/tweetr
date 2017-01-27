"use strict";

const userHelper = require("../lib/util/user-helper");
const express = require('express');
const tweetsRoutes = express.Router();
module.exports = function (DataHelpers) {


  //post to kiss return the tweet and check if use is in likes
  // if yes remove if not add
  //should be a put
  tweetsRoutes.post("/kiss", function (req,res){
    if (!req.body.tweetId) {
      res.status(400).json({error: 'invalid request: no data in POST body'});
      return;
    }
    if (!req.session.loginID) {
      res.status(401).send("You must be logged in to Kiss!");
      return;
    }
    let tweetId = req.body.tweetId;
    let userId = req.session.loginID;
    //chained promises one get the tweet the next runs logic then updates the tweet
    new Promise((resolve, reject) => {DataHelpers.findTweet(resolve, reject, tweetId)})
      .then((val) =>
        {return new Promise((resolve, reject) => {DataHelpers.kissTweet(resolve, reject, val, userId )})
        })
      .then(res.status(201).send());
  });

  //Login simpley checks the user collection for name does not validate a password
  tweetsRoutes.post("/login", function (req, res) {
    if (!req.body.loginID) {
      res.status(400).json({error: 'invalid request: no data in POST body'});
      return;
    }
    DataHelpers.getLogin(req.body.loginID, (err, userInfo) => {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        if (!userInfo[0]) return res.status(401).json({error: "User not found"});
        req.session.loginID = req.body.loginID;
        res.cookie("loginID", req.body.loginID);
        res.redirect(302, '/');
      }
    });
  });

  //Logout
  tweetsRoutes.post("/logout", function (req, res) {
    req.session = null;
    res.clearCookie("loginID");
    res.redirect(302, '/');
  });

  //register check for instance of user insert if not found
  //based on mongo unique index
  tweetsRoutes.post("/register", function (req, res) {
    if (!req.body.loginID) {
      res.status(400).json({error: 'invalid request: no data in POST body'});
      return;
    }
    const user = userHelper.generateRandomUser(req.body.loginID);
    DataHelpers.register(user, (err) => {
      if (err) {
        res.status(500).json({error: "duplicate user"});
      } else {
        req.session.loginID = req.body.loginID;
        res.cookie("loginID", req.body.loginID);
        res.redirect(302, '/');
      }
    });
  });
  //get all tweets
  tweetsRoutes.get("/", function (req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        res.json(tweets);
      }
    });
  });

  //post tweet, gets the user info from use collection, combines this with tweet text then saves
  tweetsRoutes.post("/", function (req, res) {
    if (!req.session.loginID) {
      res.status(401).send("You must be logged in to Tweet!");
      return;
    }
    if (!req.body.text) {
      res.status(400).json({error: 'invalid request: no data in POST body'});
      return;
    }
    let tweet = null;
      //get user info based on login
      const author = DataHelpers.getLogin(req.session.loginID, (err, userInfo) => {
        //nested callback for multiple db calls
        if (err) {
          res.status(500).json({error: err.message});
        } else {
          tweet = {
            // add user info from mongo to tweet
            user: userInfo[0],
            content: {
              text: req.body.text
            },
            author: req.session.loginID,
            likes: {},
            created_at: Date.now()
          };
          //save the combined data to tweets collection
          DataHelpers.saveTweet(tweet, (err) => {
            if (err) {
              res.status(500).json({error: err.message});
            } else {
              res.status(201).send();
            }
          });
        }
      });
  });

  return tweetsRoutes;
};
