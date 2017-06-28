import * as mongoose from "mongoose";

interface IUsers {
  name:String;
  phone:Number;
  email:String;
  City:String;
}

interface IUsersModel extends IUsers, mongoose.Document{};

var usersSchema = new mongoose.Schema({
  name:String,
  phone:Number,
  email:String,
  City:String
});

var quoteInstance = mongoose.model("users", usersSchema);

var Users = mongoose.model<IUsersModel>("Users", usersSchema);
export = Users;
