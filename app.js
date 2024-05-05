const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 2001;
const Course = require("./models/courseSchema");

//firebase Storage
const admin = require("firebase-admin");
const serviceAccount = require("./firebaseKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://control-system-b0840.appspot.com",
});
const bucket = admin.storage().bucket();
/////////////////////////////////////////////////////////////

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Auto refresh livereload for All Files ===> there is script in package.json
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
//////////////////////////////////////////////////////////////////////////////

function process(course) {
  const { hours, minutes, seconds, lessonContent } = course;
  // Calculate duration
  const duration = `${hours}h ${minutes}m ${seconds}s`;
  // Remove hours, minutes, and seconds from course
  delete course.hours;
  delete course.minutes;
  delete course.seconds;
  // Add duration to course
  course.duration = duration;
  // Split lessonContent into an array of words
  course.lessonContent = lessonContent.split(/\r?\n/);
  return course; // Return the processed course object
}

// GET REQUEST
app.get("/", (req, res) => {
  Course.find()
    .then((result) => {
      res.render("index", { arr: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/play", (req, res) => {
  const intro = req.query.intro;
  res.render("play", { video: intro });
});

app.get("/view", (req, res) => {
  const code = parseInt(req.query.code); // Convert code to a number
  Course.find({ code: code })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error"); // Sending an error response
    });
});

// POST REQUEST
app.post(
  "/",
  upload.fields([
    { name: "thumbnails", maxCount: 1 },
    { name: "courseIntro", maxCount: 1 },
    { name: "coursePlayList" },
  ]),
  async (req, res) => {
    const course = req.body;
    const files = req.files;
    const playlistName = course.name;

    const thumbnailFile = files["thumbnails"][0];
    const introFile = files["courseIntro"][0];
    const playlistFiles = files["coursePlayList"];

    if (!thumbnailFile || !introFile || !playlistFiles) {
      return res
        .status(400)
        .send("Thumbnails, Course Intro video, or Playlist not uploaded.");
    }

    const uploadFile = async (file, fileNamePrefix, name) => {
      const fileName = name
        ? `${fileNamePrefix}/${name}/${Date.now()}-${file.originalname}`
        : `${fileNamePrefix}/${Date.now()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);
      const stream = fileUpload.createWriteStream({
        metadata: { contentType: file.mimetype },
      });

      return await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("finish", async () => {
          const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(fileName)}?alt=media`;
          resolve(fileUrl);
        });
        stream.end(file.buffer);
      });
    };

    const [thumbnailUrl, introUrl, playlistUrls] = await Promise.all([
      uploadFile(thumbnailFile, "thumbnails"),
      uploadFile(introFile, "intros"),
      Promise.all(
        playlistFiles.map((file) => uploadFile(file, "playlists", playlistName))
      ),
    ]);

    course.thumbnails = thumbnailUrl;
    course.courseIntro = introUrl;
    course.coursePlayList = playlistUrls;

    const processedCourse = process(course);
    const newCourse = new Course(processedCourse);
    newCourse
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

mongoose
  .connect(
    "mongodb+srv://sherif:BtPusu1Iph4wsso7@cluster0.skvnzou.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

//npm init -y
//npm i express
//npm i nodemon
//npm i mongoose
//npm i ejs
//npm i livereload connect-livereload
//npm i multer
//npm i firebase-admin
