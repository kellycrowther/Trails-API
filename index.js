"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var Quote = require("./entities/quote");
var Users = require("./entities/users");
var Trails = require("./trail-model/trails");
var mongoose = require("mongoose");
var restful = require('node-restful');
// ***** COMMON VARIABLES *****
var appPort = (process.env.PORT || 8080);
var connectionString = "mongodb://heroku_vsr9srk5:ndq03g7mtfsfo8hlnnfjsvfb1j@ds135382.mlab.com:35382/heroku_vsr9srk5";
// ***** EXPRESS APP *****
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("port", appPort);
// ***** REST API LOGIC *****
var quoteApi = restful.model("quote", Quote.schema)
    .methods(["get", "post", "put", "delete"])
    .register(app, "/api/quote");
var usersApi = restful.model("users", Users.schema)
    .methods(["get", "post", "put", "delete"])
    .register(app, "/api/users");
var trailsApi = restful.model("trails", Trails.schema)
    .methods(["get", "post", "put", "delete"])
    .register(app, "/api/deschutes-trails");
// ***** DB *****
mongoose.connect(connectionString);
// ***** SERVER *****
var port = app.get("port");
var server = app.listen(port, function () {
    //debuggin purposes...
    console.log("Connection String: ", connectionString);
    console.log("Port: ", port);
    console.log("Server Started...");
});
//# sourceMappingURL=index.js.map