var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = "mongodb://heroku_vsr9srk5:ndq03g7mtfsfo8hlnnfjsvfb1j@ds135382.mlab.com:35382/heroku_vsr9srk5";

MongoClient.connect(url, function(err, db) {
  if(err){
    console.log("ERROR CONNECTING: ", err);
  } else {
    console.log("Connected to db");
    db.listCollections().toArray((err, collections) => {
      assert.equal(err, null);
      console.dir(collections);

      // showTrails(db, () =>{
      //   db.close();
      // });

      showOregon(db, () =>{
        db.close();
      });
    });
  }
});

// var showCustomers = (db, callback) => {
//   var cursor = db.collection('customers').find({});
//   cursor.each((err, doc) => {
//     assert.equal(err, null);
//     if (doc !=null) {
//       console.dir(doc);
//     } else {
//       callback();
//     }
//   });
// };

// var showQuotes = (db, callback) => {
//   var cursor = db.collection('quotes').find({});
//   cursor.each((err, doc) => {
//     assert.equal(err, null);
//     if (doc !=null) {
//       console.dir(doc);
//     } else {
//       callback();
//     }
//   });
// };

var showTrails = (db, callback) => {
  var cursor = db.collection('trails').find({});
  cursor.each((err, doc) => {
    assert.equal(err, null);
    if (doc !=null) {
      console.dir(doc);
    } else {
      callback();
    }
  });
};

var showOregon = (db, callback) => {
  var cursor = db.collection('oregon').find({});
  cursor.each((err, doc) => {
    assert.equal(err, null);
    if (doc !=null) {
      console.dir(doc);
    } else {
      callback();
    }
  });
};

//use to delete collection
// MongoClient.connect(url, function(err, db) {
//   if(err){
//     console.log("ERROR CONNECTING: ", err);
//   } else {
//     console.log("Connected to db");
//     db.collection('trails').deleteMany({})
//     .then(function(result) {
//       console.log("Deleting Trail from DB!");
//       db.close();
//     })
//   }
// });
