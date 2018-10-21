const express = require("express"); //to use router we need express first
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// bring in the Post model
const Post = require("../../models/Post");

// bring in the Profile model
const Profile = require("../../models/Profile");

// Validation
const validatePostInput = require("../../validation/post");

//@route GET api/posts/test
//@desc  Tests posts route
//@access Public
router.get("/test", (_req, res) => res.json({ message: "posts works!" })); //equivalent to app.get/post/put/etc...  in the server file. We want this file to server json.

//@route GET api/posts
//@desc  Fetch all posts
//@access Public
router.get("/", (_req, res) => {
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
    .catch(_err =>
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
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      //if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//@route DELETE api/posts/:id
//@desc  Delete post
//@access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(_profile => {
      Post.findById(req.params.id) //take the post model and we want ot find by id
        .then(post => {
          //Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
          //Delete
          Post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route POST api/like/:id
//@desc  Like post
//@access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(_profile => {
      Post.findById(req.params.id) //take the post model and we want ot find by id
        .then(post => {
          // Check to see if post has already been liked by user
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadylike: "User already liked this post" });
          }
          //add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "No likes... found" })
        );
    });
  }
);

//@route POST api/unlike/:id
//@desc  Unlike post
//@access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(_profile => {
      Post.findById(req.params.id) //take the post model and we want ot find by id
        .then(post => {
          // Check to see if post has already been liked by user
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "User has not liked this post yet" });
          }
          //Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //Splice out of array
          post.likes.splice(removeIndex, 1);

          //save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "No likes... found" })
        );
    });
  }
);

//@route POST api/posts/comment/:id
//@desc  Add comment to post
//@access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      //if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.body.id
        };
        //add comments to array
        post.comments.unshift(newComment);

        //save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//@route DELETE api/posts/comment/:id/:comment_id
//@desc  Delete comment to post
//@access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check to see if the comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "comment does not exist" });
        }
        //get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        //to remove it we need to splice it out of array
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
