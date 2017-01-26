"use strict";

const userHelper = require("../lib/util/user-helper")
const express = require('express');
const tweetsRoutes = express.Router();
module.exports = function (DataHelpers) {

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
        res.redirect(302, '/');
      }
    });
  });

  tweetsRoutes.post("/logout", function (req, res) {
    req.session = null;
    res.redirect(302, 'http://localhost:8080/');
  });


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
        res.redirect(302, '/');
      }
    });
  });

  tweetsRoutes.get("/", function (req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({error: err.message});
      } else {
        res.json(tweets);
      }
    });
  });


  //if not logged generate random user and post
  //you should refactor this to use promises
  // and just clean it up
  tweetsRoutes.post("/", function (req, res) {
    if (!req.body.text) {
      res.status(400).json({error: 'invalid request: no data in POST body'});
      return;
    }
    let tweet = null;
    const callSave = function (tweet) {
      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({error: err.message});
        } else {
          res.status(201).send();
        }
      });
    };
    if (!req.session.loginID) {
      const user = req.body.user ? req.body.user : userHelper.generateRandomUser(null);
      tweet = {
        user: user,
        content: {
          text: req.body.text
        },
        author: user.username,
        likes: {},
        created_at: Date.now()
      };
      console.log("loggedOUT");
      callSave(tweet)
    } else {
      //get user
      console.log("loggedIN");
      const author = DataHelpers.getLogin(req.session.loginID, (err, userInfo) => {
        if (err) {
          res.status(500).json({error: err.message});
        } else {
          tweet = {
            // author info from mongo
            user : userInfo[0],
            content: {
              text: req.body.text
            },
            author: req.session.loginID,
            likes: {},
            created_at: Date.now()
          };
          callSave(tweet);
        }
      });
    }
  });
  return tweetsRoutes;
};
