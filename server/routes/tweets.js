"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.post("/login", function(req,res){

  });

  tweetsRoutes.post("/register", function(req,res){
    if (!req.body.loginID) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    const user = userHelper.generateRandomUser(req.body.loginID);
    DataHelpers.register(user, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.redirect(302, '/');
      }
    });
  });


  tweetsRoutes.get("/", function(req, res) {
      DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const tweet = {
      // author
      content: {
        text: req.body.text
      },
      created_at: Date.now()
    };

    //noinspection JSAnnotator
      DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return tweetsRoutes;

}
