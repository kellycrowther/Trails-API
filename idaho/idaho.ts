import * as mongoose from "mongoose";

interface IIdaho {
  name:String;
  description: String;
}

interface IUsersModel extends IIdaho, mongoose.Document{};

var idahoSchema = new mongoose.Schema({
  name:String,
  description: String,
});

var idahoInstance = mongoose.model("idaho", idahoSchema);

var Idaho = mongoose.model<IUsersModel>("Idaho", idahoSchema);
export = Idaho;
