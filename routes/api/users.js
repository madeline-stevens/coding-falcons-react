const express = require("express"); //to use router we need express first
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load User model
const User = require("../../models/User");

//HEADER INFO BELOW
//@route GET api/users/test
//@desc  Tests users route
//@access Public
router.get("/test", (req, res) => res.json({ message: "users works!" })); //equivalent to app.get/post/put/etc...  in the server file. We want this file to server json.

//HEADER INFO BELOW
//@route GET api/users/register
//@desc  To register a user
//@access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    //with mongoose you can either use a callback or a promise
    if (user) {
      //if there is a user with that email address
      return res.status(400).json({ email: "email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });
      const newUser = new User({
        //creating a resource w/ mongoose
        name: req.body.name, //this is coming from our react form
        email: req.body.email,
        avatar, //with ES6 because "avatar: avatar" would have been the same we can just simplify it
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          //the hash is what we want to store in db
          if (err) throw err;
          newUser.password = hash; //right now pw is plain text but we want to set it to the hash
          newUser
            .save()
            .then(user => res.json(user)) //gives us the user and sends back a successful response
            .catch(err => console.log(err)); //incase something goes wrong we want to console.log the error
        });
      });
    }
  });
});

// @route  GET api/users/login
// @desc   Login User / Returning JWT Token
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password; //this is the user typed pw that will be plane text but the password in the db is hashed

  //find user by email
  User.findOne({ email }) //same as 'email: email', find one by email
    .then(user => {
      //promise that checks for the user
      if (!user) {
        return res.status(404).json({ email: "User not found" });
      }
      // now we Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        //compare the typed pw with the db hashed pw
        if (isMatch) {
          // user mathed

          const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create JWT payload

          //sign token
          jwt.sign();
        } else {
          return res.status(400).json({ password: "password incorrect" });
        }
      });
    });
});

module.exports = router;
