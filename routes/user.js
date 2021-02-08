const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

//MODELS
const Favorite = require("../models/Favorites");
const User = require("../models/Users");

// SIGNUP
router.post("/user/signup", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.fields.email });
  
      if (user) {
        res.status(409).json({ message: "This email already has an account" });
  
      } else {
        if (req.fields.email && req.fields.password) {
  
          // PASSWORD 
          const token = uid2(64);
          const salt = uid2(64);
          const hash = SHA256(req.fields.password + salt).toString(encBase64);
  
          // NEW USER
          const newUser = new User({
            email: req.fields.email,
            token: token,
            hash: hash,
            salt: salt,
          });
  
          // SAVE THE NEW USER
          await newUser.save();
          res.status(200).json(newUser);
        } else {
          res.status(400).json({ message: "Missing parameters" });
        }
      }
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  });

  //SIGN IN
  router.post("/user/signin", async (req,res) => {
    try {
        const user = await User.findOne({ email: req.fields.email });
    
        if (user) {
          if ( // SAME PASSWORD
            SHA256(req.fields.password + user.salt).toString(encBase64) ===
            user.hash
          ) {
            res.status(200).json(user);
          } else { // ERROR
            res.status(401).json({ error: "Unauthorized" });
          }
        } else {
          res.status(400).json({ message: "User not found" });
        }
      } catch (error) {
        console.log(error.message);
        res.json({ message: error.message });
      }
  });

module.exports = router;