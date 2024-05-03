const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 2001;
app.use(express.urlencoded({ extended: true }));
const Mydata = require("./models/mydataSchema");
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

app.get("/", (req, res) => {
  // result ==> Array of object
  Mydata.find()
    .then((result) => {
      res.render("home", { mytitle: "Home Page", arr: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/users", (req, res) => {
  res.send(`<h1> The Data Send Successfully </h1>`);
});

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

app.post("/", (req, res) => {
  console.log(req.body);
  const user = new Mydata(req.body);
  user
    .save()
    .then(() => {
      res.redirect("/users");
    })
    .catch((err) => {
      console.log(err);
    });
});

//npm init -y
//npm i express
//npm i nodemon
//npm i mongoose
//npm i ejs
//npm i livereload connect-livereload
