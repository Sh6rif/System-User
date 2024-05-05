const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define The Schema
const courseSchema = new Schema({
  code: Number,
  name: String,
  category: String,
  lesson: Number,
  description: String,
  lessonContent: Array,
  thumbnails: String,
  courseIntro: String,
  coursePlayList: Array,
  duration: String,
});

//Create a model
const Course = mongoose.model("Course", courseSchema);

//export The Model
module.exports = Course;
