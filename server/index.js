"use strict";
const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://localhost:27017/tweeter";
const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['prettykitty'],
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  // mongo user name needs to be unique
  // db.user.ensureIndex( { "name": 1.0 }, { unique: true } )


  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  let helpers = require("./lib/data-helpers.js")(db);
  let tweetsRoutes = require("./routes/tweets")(helpers);
  app.use("/tweets", tweetsRoutes);
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
