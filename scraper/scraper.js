"use strict";

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var linkscrape = require('linkscrape');
var Promise = require('promise');
var MongoClient = require('mongodb').MongoClient;
var Mongoose = require("mongoose");
var url = "mongodb://heroku_vsr9srk5:ndq03g7mtfsfo8hlnnfjsvfb1j@ds135382.mlab.com:35382/heroku_vsr9srk5";

var arrayTrailUrls = [];
var fullTrailDetails = [];
// var listingLinksAllRegions = [];

var oregonRegions = [
  'wallowa-whitman',
  'crgnsa',
  'ochoco',
  'fremont-winema',
  'klamath',
  'malheur',
  'mthood',
  'ochoco',
  'rogue-siskiyou',
  'siuslaw',
  'umpqua',
  'umatilla',
  'deschutes',
  'willamete'
];

var recreationMode = [
  'climbing',
  'camping-cabins',
  'bicycling',
  'fishing',
  'hiking',
  'horseriding-camping',
  'hunting',
  'ohv',
  'wateractivities',
  'wintersports'
];

//*******ideas for improvement****************
//-include absolute path/href for each trail so user can click on the trail
//-include photo of each trail
//-include relative area within county the trail is located (if info is available)
//-include elevation change as single number
//-allow user to put in the trail area (e.g Deschutes National Forest URL) and scrape those trail Urls
//-real time loading of HTML table after user puts in trail area


//working function to scrape trail details off particular page and pass details
//into an array

// request('http://www.fs.usda.gov/recarea/deschutes/recreation/hiking/recarea/?recid=38440&actid=50', function scrapeTrailInfo(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     var $ = cheerio.load(body);
//     var trailInfo = [];
//     var trailName = [];
//     var trailDetails = [];
//     $('#pagetitletop').each(function(i, element){
//       var div = $(this).find('h1');
//       trailName = $(this).text().trim();
//       trailInfo.push(trailName);
//     });
//     $('#rightcol .themetable .right-box').each(function(i, element){
//       var div = $(this).find('div.box');
//       trailDetails = $(this).text().trim();
//       trailInfo.push(trailDetails);
//     });
//     // trailInfo.push(trailName,trailDetails);
//     console.log(trailInfo);
//     fs.appendFileSync('trailInfo.txt', trailInfo + '\n');
//   };
// });

//data base LOGIC

Mongoose.connect(url);
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log("Connection with database succeeded.");
});

function addToDB(trailInfo) {
  console.log("Trail Info: ", trailInfo);
  db.collection("oregons").update(
    {
      region: trailInfo.region
    },{$push:
      {
        trailInfo
      }
    },
    {
      upsert: true
    },
  )
  console.log("Added to DB");
}

// function addToDB(trailInfo) {
//     console.log("Added to DB");
//     // db.collection("oregon").insert(trailInfo);
//     db.collection("oregons").insert(
//       {
//         "name": "Oregon Test",
//         "description": "Oregon Test"
//       }
//     )
// }
//
// addToDB();
//
// function test(){
//   db.collection("oregons").insert(
//     {
//       "name": "Oregon Test",
//       "description": "Oregon Test"
//     }
//   );
//   console.log("Added to DB");
// }
//
// test();


// let test = {
//   "deschutes": [
//     {
//       "hike": [
//         {
//           "description": "hike",
//           "name": "hike"
//         }
//       ]
//     }
//   ]
// }
//
// var doc =   {
//     name: [
//       "Jan",
//       "Kelly"
//     ],
//     phone: 5415490544,
//     email: "jan@jan.com"
//   };
//
// function addDoc() {
//   db.collection("oregon").update(
//     {
//       region: wallowa.hiking
//     },{$push:
//       {
//         "description": "hiking in the great outdoors",
//         "name": "meadow camp"
//       }
//     },
//     {
//       upsert: true
//     },
//   )
//   console.log("Added to DB");
// }




// activities: trailInfo.activities,
// description: trailInfo.description,
// directions: trailInfo.directions,
// elevation: trailInfo.elevation,
// latitude: trailInfo.latitude,
// length: trailInfo.length,
// longitude: trailInfo.longitude,
// table: trailInfo.table,
// name: trailInfo.name


//requesting each page and scraping details from each page
function trailDetails(arrayTrailUrls) {
  arrayTrailUrls.forEach(function(trailsUrls) {
    request(trailsUrls, scrapeTrailInfo);
  });

};

// scraper for each separate trail
function scrapeTrailInfo(error, response, body) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    var trailInfo = [];
    var tableArray = [];
    var trailData = {
      activities: [],
      description: "",
      directions: "",
      elevation: "",
      latitude: "",
      length: "",
      longitude: "",
      table: [],
      name: "",
      region: ""
    };

    //getting the trail name
    $('#pagetitletop').each(function(i, element){
      var div = $(this).find('h1');
      var name = $(this).text().trim();
      // trailInfo.push(trailName);
      trailData.name = name;
      // console.log("Trail Name: ", trailName);
    });

    //getting the lat, lng, trail length, elevation from right side bar
    $('#rightcol .themetable .right-box').each(function(i, element){

      var length = $(this).filter((data) =>{

        return $(this).text().trim() === 'Area/Length :';
      }).next().text().trim();

        if(length.length > 0 ) {
          length = parseFloat(length);
          // console.log("Length: ", length);
          trailData.length = length;
        }

      var latitude = $(this).filter((data) =>{
        return $(this).text().trim() === 'Latitude :';
      }).next().text().trim();
      // console.log("Latitude Length: ", latitude.length);

      if(latitude.length > 3){
        latitude = parseFloat(latitude);
        // console.log(latitude);
        // console.log("Latitude: ", typeof latitude);
        trailData.latitude = latitude;
      }


      var longitude = $(this).filter((data) =>{
        return $(this).text().trim() === 'Longitude :';
      }).next().text().trim();
      if(longitude.length > 0){
        longitude = parseFloat(longitude);
        // console.log(longitude);
        // console.log("Longitude: ", typeof longitude);
        trailData.longitude = longitude;
      }


      var elevation = $(this).filter((data) =>{
        return $(this).text().trim() === 'Elevation :';
      }).next().text().trim();

      if(elevation.length > 0){
        elevation = parseFloat(elevation);
        // console.log("Elevation: ", elevation);
        trailData.elevation = elevation;
      }

    });

    $('#centercol strong').each(function(i, element){

      var heading = $(this).text().trim();

      if((heading === 'Directions:') && ($(this).next() != undefined)){
        var directions = $(this).next().text().trim();

        // console.log("Directions: ", directions);
        trailData.directions = directions;
      }

    })

    $('#centercol').each(function(i, element){

      var description = $(this).find('p').first().text().trim();

      // console.log("Description: ", description);

      trailData.description = description;

    });

    $('#centercol th').each(function(i, element) {
      if($(this).text().trim() != undefined){
        var tableHeading = $(this).text().trim();
      }
      if($(this).next().text().trim() != undefined) {
        var tableDetails = $(this).next().text().trim();
      }
      // console.log("Table Details: ", tableHeading + " " + tableDetails);
      // console.log("Table Details: ", details);
      var tableObj = {
        tableHeading: tableHeading,
        tableDetails: tableDetails
      };
      trailData.table.push(tableObj);
      // console.log("Table Info: ", trailData.table);
    });

    //get activities
    $('#centercol .themetd h4').each(function(i, element) {
      if($(this).text().trim() != undefined) {
        var activity = $(this).text().trim();
        console.log("Activity: ", activity);
      }
      trailData.activities.push(activity);
      console.log("Activities Array: ", trailData.activities);
    });

    //get region
    var region = $('#leftcol .themetable .navleft .heading').first().text().trim();
    trailData.region = region;
    console.log("Region: ", trailData.region);


    console.log("Trail Data Object: ", trailData);

    //insert trail info into database
    if(trailData.name.length > 0) {
      addToDB(trailData);
    }

    // return trailInfo.push(trailData);
    // trailInfo.push(trailName,trailDetails);
    // console.log(trailInfo);

    //append to text file
    // fs.appendFileSync('trailInfo.txt', trailInfo + '\n');

    // fullTrailDetails.push(trailData)
    // console.log(fullTrailDetails);
  };
};


//passing the relative path names into absolute paths and into an array

function getURLs(metadataObjects) {
    arrayTrailUrls = [];
    metadataObjects.forEach(function(metadata) {
      var trailsUrls =  'http://www.fs.usda.gov' + metadata.url;
      // console.log(trailsUrls);
      arrayTrailUrls.push(trailsUrls);
    });
    // console.log(arrayTrailUrls);
    trailDetails(arrayTrailUrls);
};

//scraping the table of content URls to be requested

function detailLinks(listingLinksAllRegions){
  console.log("Detail Link Started");
  console.log("Detail Links Array: ", listingLinksAllRegions);
  listingLinksAllRegions.forEach((listingLink) => {
    console.log("Detail Link: ", listingLink);
    request('http://www.fs.usda.gov/' + listingLink, function (error, response, html) {
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(html);
          var metadataObjects = [];

          $('#centercol .themetable ul li a').each(function(i, element){
            if($(this).attr('style') != undefined) {
              var category = $(this).text();
              console.log("Category: ", category);
            };
          });

          $('#centercol .themetable ul li').each(function(i, element){
            var a = $(this).find('a');
            var title = a.text();
            var url = a.attr('href');
            // Our parsed meta data object
            var metadata = {
              title: title,
              url: url
            };
            metadataObjects.push(metadata);
            // relativePathUrls.push(url);
            // console.log(metadata);
            // fs.appendFileSync('links.txt', url)
          });
          getURLs(metadataObjects);
        };
        // console.log(relativePathUrls);
        return true;
      });
  })
}



  // /recmain/deschutes/recreation
  function oregonAreas() {
    var listingLinksAllRegions = [];
    for(let x = 0; x<oregonRegions.length; x++) {
      console.log(oregonRegions[x]);
      for(let y = 0; y<recreationMode.length; y++) {
        console.log(recreationMode[y]);
        request('http://www.fs.usda.gov/activity/' + oregonRegions[x] + '/recreation/' + recreationMode[y], function(error, response, html) {
          if(!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            $('#centercol .themetable ul li a').each(function(i, element) {
              var link = $(this).attr('href');
              // console.log(link);
              if(link.includes('/activity/')){
                console.log("Oregon Areas: ", link)
                listingLinksAllRegions.push(link);
              }
            })
            detailLinks(listingLinksAllRegions);
            }
          })
        }
      }
      return true;
      // detailLinks(listingLinksAllRegions);
    }

  oregonAreas();
