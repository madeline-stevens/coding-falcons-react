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

//@route GET api/posts
//@desc  Fetch all posts
//@access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404))
    .json({ nopostsfound: "No posts found with that id" });
});

//@route GET api/post/:id
//@desc  Fetch a single post by id
//@access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that id" })
    );
});

//@route POST api/posts
//@desc  Create posts
//@access Private
router.post(
  "/", //just '/' becuase we're already in the posts file
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
