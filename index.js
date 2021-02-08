const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(formidable());

require('dotenv').config();

// MONGOOSE CONNECT
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true});

const userRoutes = require("./routes/user");
const favoriteRoutes = require("./routes/favorite");
app.use(userRoutes);
app.use(favoriteRoutes);

app.get('/', (req, res) => {
    res.send("TRUE")
})



app.listen(process.env.PORT || 3200, () => {
    console.log("Server started");
  });