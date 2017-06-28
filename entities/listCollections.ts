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

      showQuotes(db, () =>{
        db.close();
      });
    });
  }
});

var showCustomers = (db, callback) => {
  var cursor = db.collection('customers').find({});
  cursor.each((err, doc) => {
    assert.equal(err, null);
    if (doc !=null) {
      console.dir(doc);
    } else {
      callback();
    }
  });
};

var showQuotes = (db, callback) => {
  var cursor = db.collection('quotes').find({});
  cursor.each((err, doc) => {
    assert.equal(err, null);
    if (doc !=null) {
      console.dir(doc);
    } else {
      callback();
    }
  });
};
