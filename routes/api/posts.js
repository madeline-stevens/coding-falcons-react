const express = require("express"); //to use router we need express first
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// bring in the Post model
const Post = require("../../models/Post");

// Validation
const validatePostInput = require("../../validation/post");

//@route GET api/posts/test
//@desc  Tests posts route
//@access Public
router.get("/test", (req, res) => res.json({ message: "posts works!" })); //equivalent to app.get/post/put/etc...  in the server file. We want this file to server json.

// Check validation
if (!isValid) {
  // if any errors, send 400 status with errors object
  return res.status(400).json(errors);
}

//@route POST api/posts
//@desc  Create postss
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.body.user
    });
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
