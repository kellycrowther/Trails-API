"use strict";
var mongoose = require("mongoose");
;
var trailsSchema = new mongoose.Schema({
    description: String,
    directions: String,
    elevation: String,
    latitude: String,
    length: String,
    longitude: String,
    table: [],
    trailName: String
});
var trailsInstance = mongoose.model("trails", trailsSchema);
var Trails = mongoose.model("Trails", trailsSchema);
module.exports = Trails;
//# sourceMappingURL=trails.js.map