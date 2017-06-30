"use strict";

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var linkscrape = require('linkscrape');
var Promise = require('promise');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://heroku_vsr9srk5:ndq03g7mtfsfo8hlnnfjsvfb1j@ds135382.mlab.com:35382/heroku_vsr9srk5";

var arrayTrailUrls = [];
var fullTrailDetails = [];

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
function addToDB(trailInfo) {
  MongoClient.connect(url, function(err, db) {
    if(err){
      console.log("Error Connecting to Database: ", err);
    } else {
      console.log("Connected to Database");

      db.collection("trails").insert(trailInfo, function(err, data) {
        if(err) {
          console.log("Error Inserting Data: ", err);
          throw(err);
        }
        else {
          console.log("Successfully inserted data: ", data);
        }
      })
    }
  })
}


// requesting each page and scraping details from each page
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
      description: "",
      directions: "",
      elevation: "",
      latitude: "",
      length: "",
      longitude: "",
      tableInfo: [],
      trailName: "",
    };

    //getting the trail name
    $('#pagetitletop').each(function(i, element){
      var div = $(this).find('h1');
      var trailName = $(this).text().trim();
      // trailInfo.push(trailName);
      trailData.trailName = trailName;
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

      trailData.tableInfo.push(tableObj);
      // console.log("Table Info: ", trailData.tableInfo);
    })

    // console.log("Trail Data Object: ", trailData);

    //insert trail info into database
    if(trailData.trailName.length > 0) {
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

request('http://www.fs.usda.gov/activity/deschutes/recreation/hiking/?recid=38280&actid=50', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var metadataObjects = [];
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
