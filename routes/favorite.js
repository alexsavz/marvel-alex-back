const express = require("express");
const router = express.Router();

//MODELS
const Favorite = require("../models/Favorites");
const User = require("../models/Users");

// add a comic or a character into the Favorite collection
router.post("/createfav", async (req, res) => {
    console.log("route : /createfav"); 
    
    try {

        // Check if the comics or character is already in the favorite list of the user
        const isUser = await User.findOne({token : req.fields.user});
        const findFavorite = await Favorite.find({title: req.fields.title, user: isUser._id }).populate("user");
        // console.log(FindFavorite);
        console.log(isUser);
        
        const isFavorite = findFavorite.filter( (favorite) => {
            return favorite.user.email === isUser.email;
        });
        console.log(isFavorite);

        if(isFavorite.length >= 1){
            res.status(409).json({message : "This comics or character is already in your favorites"})
        }
        else {
            if(req.fields.title){
                const newFavorite = new Favorite({
                    id: req.fields.id,
                    type: req.fields.type,
                    title: req.fields.title,
                    description: req.fields.description,
                    url: req.fields.url,
                    user: isUser
                    });
            
                    await newFavorite.save();
                    
                    res.json(newFavorite);
            }
        }
        
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Fetch the favorite list which match a specific connected user
router.get("/list", async (req, res) => {
    console.log("route : /list");
    try {
      console.log(req.headers);
      if (req.headers.authorization) {
          const token = req.headers.authorization.replace("Bearer ", "");

          const connectedUser = await User.findOne({token : token});

            if(connectedUser){
              const favorites = await Favorite.find({user : connectedUser._id});
              res.json(favorites);
            }
            else{
              return res.status(401).json({
                message: "Unauthorized",
              });
            }
            }
      else{
        return res.status(401).json({
          message: "Unauthorized",
        });
      }        
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete a specific user favorite 
  router.post("/deletefav", async (req, res) => {
    console.log("route : /deletefav"); 

    try {
        const user = await User.findOne({token : req.fields.user});
        const findFavorite = await Favorite.findOne({id: req.fields.id, user: user._id }).populate("user");

        await findFavorite.deleteOne();
        res.status(200).json("Offer deleted succesfully !");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
module.exports = router;