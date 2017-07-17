import * as express from "express";
import * as bodyParser from "body-parser";
import * as Quote from "./entities/quote";
import * as Users from "./entities/users";
import * as Trails from "./trail-model/trails";
import * as Oregon from "./oregon-model/oregon";
import * as mongoose from "mongoose";

var restful = require('node-restful');

// ***** COMMON VARIABLES *****
let appPort: number = (process.env.PORT || 8080);
let connectionString: string = "mongodb://heroku_vsr9srk5:ndq03g7mtfsfo8hlnnfjsvfb1j@ds135382.mlab.com:35382/heroku_vsr9srk5";

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

var trailsApi = restful.model("oregon", Oregon.schema)
  .methods(["get", "post", "put", "delete"])
  .register(app, "/api/oregon");

// ***** DB *****
mongoose.connect(connectionString);

// ***** SERVER *****
let port:number = app.get("port");
var server = app.listen(port, function() {
  //debuggin purposes...
  console.log("Connection String: ", connectionString);
  console.log("Port: ", port);
  console.log("Server Started...");
})
