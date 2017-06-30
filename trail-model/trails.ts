import * as mongoose from "mongoose"

interface ITrails {
  description: String;
  directions: String;
  elevation: String;
  latitude: String;
  length: String;
  longitude: String;
  table: Array<any>;
  trailName: String;
}

interface ITrailsModel extends ITrails, mongoose.Document{};

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

var Trails = mongoose.model<ITrailsModel>("Trails", trailsSchema);
export = Trails;
