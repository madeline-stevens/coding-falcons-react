"use strict";
//setting up our npm stuff and creating app and client

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// DB config
const db = require("./config/keys").mongoURI;

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
