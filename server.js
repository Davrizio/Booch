const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const brewRoutes = require("./routes/brews");
const recipeRoutes = require("./routes/recipes");
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const customParseFormat = require('dayjs/plugin/customParseFormat')


//Use DayJs
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
app.locals.dayjs = dayjs

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Flowbite
app.get('/flowbite.min.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/flowbite/dist/flowbite.min.js');
})

//Flowbite DatePicker
app.get('/datepicker.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/flowbite/dist/datepicker.js');
})

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/brew", brewRoutes);
app.use("/recipe", recipeRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
