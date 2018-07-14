"use strict";
//setting up our npm stuff and creating app and client

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//Body Parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("mongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hello world"));

// use routes
app.use("/api/users", users); //we want api/users to go to users
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on ${port}`));

//-- non react app below --
// const bodyParser = require('body-parser');
// const pg = require("pg");
// const cors = require("cors");
// const PORT = process.env.PORT || 3000;
// const conString = process.env.DATABASE_URL;
// const client = new pg.Client(conString);

// // var path = require('path');
// client.connect();
// client.on("error", err => console.error(err));

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
// app.use(cors());
// // app.use(bodyParser.json());
// app.use(express.static("./public"));

// //routes
// app.get("/*", (req, res) => {
//   console.log("__REQUEST__ : ", req);
//   console.log("__RESPONSE__ : ", res);
//   res.sendFile("index.html", { root: "./public" });
// });
