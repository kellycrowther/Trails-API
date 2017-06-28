"use strict";
var mongoose = require("mongoose");
;
var usersSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    City: String
});
var quoteInstance = mongoose.model("users", usersSchema);
var Users = mongoose.model("Users", usersSchema);
module.exports = Users;
//# sourceMappingURL=users.js.map