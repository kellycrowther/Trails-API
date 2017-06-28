import * as mongoose from "mongoose";

interface IQuote {
  text:String;
  author:String;
}

interface IQuoteModel extends IQuote, mongoose.Document{};

var quoteSchema = new mongoose.Schema({
  text:String,
  author:String
});

var quoteInstance = mongoose.model("quoteInstance", quoteSchema);



var Quote = mongoose.model<IQuoteModel>("Quote", quoteSchema);
export = Quote;
