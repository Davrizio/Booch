const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const brewsController = require("../controllers/brews");
const recipesController = require("../controllers/recipes");

const { ensureAuth } = require("../middleware/auth");

//Main Routes
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, brewsController.getProfile);
router.get("/recipes", ensureAuth, recipesController.getRecipes);
router.get("/pastBrews", ensureAuth, brewsController.getPastBrews);

//Routes for user login/signup
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.post("/login/editUser/:id", authController.editUser);
router.post("/login/editUserPicture/:id", authController.editUserPicture);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
