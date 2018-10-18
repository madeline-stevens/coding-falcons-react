const express = require("express"); //to use router we need express first
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

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
//@access Private //becuase this is a private route we need passport and can't just write out the whole route path
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(400).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route POST api/profile/all
//@desc  Get all profiles
//@access Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(400).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

//@route POST api/profile/handle/:handle  --> this is a backend api route (gets hit by frontend)
//@desc  Get profile by handle
//@access Public --> anyone can see a profile by the handle

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//@route POST api/profile/user/:user_id  --> this is a backend api route (gets hit by frontend)
//@desc  Get profile by user id
//@access Public --> anyone can see a profile by the handle

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//@route POST api/profile
//@desc  Create OR edit user profile
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body); //we want to get erros and isValid, and we want to take that from validateProfileInput

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

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
        //UPDATE- if profile then we just want to UPDATE
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
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
);

//@route POST api/profile/experience
//@desc  Add experience to profile
//@access Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body); //we want to get errors and isValid, and we want to take that from validateProfileInput

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      //Add to experience array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile)); //take existing prof and save it and that will give us a promise so we .then it that will give us the profile and then we want to res.json the profile. It will add exp and return the profile with the new experience content. And in our frontend it will update the state.
    });
  }
);

//@route POST api/profile/education
//@desc  Add experience to profile
//@access Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body); //we want to get errors and isValid, and we want to take that from validateProfileInput

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current
      };

      //Add to experience array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

//@route DELETE api/profile/experience/:exp_id
//@desc  Delete experience from profile
//@access Private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //find the experience we want to delete...so get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        //splice the experience to be deleted out of array
        profile.experience.splice(removeIndex, 1); //with removeIndex we now know which one we want to remove, and we want to remove just one from our removeIndex var
        //save
        profile.save().then(profile => res.json(profile)); //save the new profile and send it back
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
