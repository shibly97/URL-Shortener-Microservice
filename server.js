"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.DB_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/shorturl/new", (req, res) => {
  var postUrl = req.body.url;

  const urlSchema = new mongoose.Schema({
    url: String,
    place: Number
  });

  const Url = mongoose.model("Url", urlSchema);

  let placeNumber = 1;

  Url.find({ url: postUrl }, (err, result) => {
    if (err) {
      res.json({error : "Url not found"});
    } else {
      res.json({hello_babay: result});
    }
  });
  //******* save
  // let ffc = new Url({ url: postUrl, place: placeNumber });

  // ffc.save((err, result) => {
  //   if (err) {
  //     res.json(err);
  //   } else {
  //     res.json(result);
  //   }
  // });
  //*******
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
