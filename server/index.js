"use strict";

// Basic express setup:

const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
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
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  let helpers = require("./lib/data-helpers.js")(db);
  let tweetsRoutes = require("./routes/tweets")(helpers);
  app.use("/tweets", tweetsRoutes);
  db.close();
});


//need to create a callback that handles all of this


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
