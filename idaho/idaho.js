"use strict";
var mongoose = require("mongoose");
;
var idahoSchema = new mongoose.Schema({
    name: String,
    description: String,
});
var idahoInstance = mongoose.model("idaho", idahoSchema);
var Idaho = mongoose.model("Idaho", idahoSchema);
module.exports = Idaho;
//# sourceMappingURL=idaho.js.map