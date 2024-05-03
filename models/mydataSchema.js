const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define The Schema
const articleSchema = new Schema({
  UserName: String,
});

//Create a model
const Mydata = mongoose.model("Mydataa", articleSchema);

//export The Model
module.exports = Mydata;
