"use strict";

// Basic express setup:

const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";
const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// this works but it is not great,  needs to be refactored to make more sense and be closeable
MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  //add create user collection is none exists

  // db.collection("tweets").find({"user.name" : {$exists:true}}).toArray((err, results) => {
  //   if (err) throw err;
  //
  //   console.log("results array: ", results);
  //
  //   // This is the end...
  // });





  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  let helpers = require("./lib/data-helpers.js")(db, app);
  let tweetsRoutes = require("./routes/tweets")(helpers);
  app.use("/tweets", tweetsRoutes);
});


//need to create a callback that handles all of this


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
