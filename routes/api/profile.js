const express = require("express"); //to use router we need express first

const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model
const Profile = require("../../models/Profile");
// Load User profile
const User = require("../../models/User");

//HEADER INFO BELOW
//@route GET api/profile/test
//@desc  Tests profile route
//@access Public
router.get("/test", (req, res) => res.json({ message: "profile works!" })); //equivalent to app.get/post/put/etc...  in the server file. We want this file to server json.

//HEADER INFO BELOW
//@route GET api/profile
//@desc  Get current users profile
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(400).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
); //becuase this is a private route we need passport and can't just write out the whole route path

//HEADER INFO BELOW
//@route POST api/profile
//@desc  Create OR edit user profile
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get fields
    const profileFields = {}; //everything that comes in through that form will go into this empty object
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    //skills need to be split into an array (coming in as CSV)
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //social links
    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //if profile then we just want to UPDATE
        profile
          .findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
          .then(profile => res.json(profile));
      } else {
        //CREATE

        //Check to see if the handle already exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          //save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
); //becuase this is a private route we need passport and can't just write out the whole route path

module.exports = router;
