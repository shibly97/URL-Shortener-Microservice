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

const urlSchema = new mongoose.Schema({
  url: String,
  place: Number
});

const Url = mongoose.model("Url", urlSchema);

app.post("/api/shorturl/new", (req, res) => {
  var postUrl = req.body.url;
  let placeNumber = 1;
  
  var urlregex = "/(http(s)?://.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/"
    
  if(!postUrl.match(urlregex)){
    return res.json({error: "invalid"}) 
  }

  Url.find({ url: postUrl }, (err, result) => {
    // res.json(result)
    // res.json({outif : result})
    
    
    if (err) {
     res.json(err)
    }else{
      if(result.length != 0){
        res.json({ original_url: result[0].url, short_url: result[0].place })
      }
      else{
        Url.findOne({})
        .sort({ place: "desc" })
        .exec((err, placeResult) => {
          if (placeResult.place >= 1) {
            placeNumber = placeResult.place + 1;
          }
          
          let ffc = new Url({ url: postUrl, place: placeNumber });

              ffc.save((err, result) => {
                if (err) {
                  res.json(err);
                } else {
                  res.json(result);
                }
              });
        })
      }
      }   
    //   else{ 
    //       ;}
    //   // res.json(result)  
    //   // console.log(err)  
    // }  
  });  
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});

//   Url.find({ url: postUrl }, (err, mainResult) => {
//     if (err) {
//       res.json(err);
//     } else {
//       // res.send(mainResult);
//       if (res.json(mainResult) == []) {
//       //******* save
//       // ***** save
//       // Url.findOne({})
//       //   .sort({ place: "desc" })
//       //   .exec((err, placeResult) => {
//       //     if (placeResult.place >= 1) {
//       //       placeNumber = placeResult.place + 1;
//       //     }
//       //   });

//              
//       //*******
//       }
//       else {
//         res.json({
//           original_url: mainResult[0].url,
//           short_url: mainResult[0].place
//         });
//       }
//     }
// });
