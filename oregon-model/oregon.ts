import * as mongoose from "mongoose"

interface IOregon {
  description: String;
  directions: String;
  elevation: String;
  latitude: String;
  length: String;
  longitude: String;
  table: Array<any>;
  trailName: String;
}

interface IOregonModel extends IOregon, mongoose.Document{};

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

var Oregon = mongoose.model<IOregonModel>("Oregon", oregonSchema);
export = Oregon;
