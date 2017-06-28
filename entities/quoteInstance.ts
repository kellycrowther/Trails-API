import * as Quote from "./quote";


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://heroku_vsr9srk5:ndq03g7mtfsfo8hlnnfjsvfb1j@ds135382.mlab.com:35382/heroku_vsr9srk5";

// MongoClient.connect(url, function(err, db) {
//   if(err){
//     console.log("ERROR CONNECTING: ", err);
//   } else {
//     console.log("Connected to db");
//     db.collection("customers").insert({"test2": "hello, world2"}, function(err, data) {
//       if(err) {
//         console.log("ERROR INSERTING: ", err);
//         throw(err);
//       }
//       else{
//         console.log("Successfully inserted");
//         console.log("Data Inserted: ", data);
//       }
//     })
//   }
// })

var myQuotesObject = [
  {
    "text": "I'm the greatest sorcerer to ever live!",
    "author": "Drizzt Do'Urden"
  },
  {
    "text": "The first rule of Wizardery is...",
    "author": "Khan the Great"
  },
  {
    "text": "Thread falls from the sky",
    "author": "Lessa and F'Lar"
  }
];


  MongoClient.connect(url, function(err, db) {
    if(err){
      console.log("ERROR CONNECTING: ", err);
    } else {
      for (var x = 0; x<myQuotesObject.length; x++) {
        console.log("Connected to db");
        db.collection("quotes").insert(myQuotesObject[x], function(err, data) {
          if(err) {
            console.log("ERROR INSERTING: ", err);
            throw(err);
          }
          else{
            console.log("Successfully inserted");
            console.log("Data Inserted: ", data);
            // db.close();
          }
        })
      }
    }
  })
