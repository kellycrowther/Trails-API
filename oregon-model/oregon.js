"use strict";
var mongoose = require("mongoose");
;
var oregonSchema = new mongoose.Schema({
    description: String,
    directions: String,
    elevation: String,
    latitude: String,
    length: String,
    longitude: String,
    table: [],
    trailName: String
});
var oregonInstance = mongoose.model("oregon", oregonSchema);
var Oregon = mongoose.model("Oregon", oregonSchema);
module.exports = Oregon;
//# sourceMappingURL=oregon.js.map