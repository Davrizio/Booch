const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const recipesController = require("../controllers/recipes");
const { ensureAuth } = require("../middleware/auth");

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, recipesController.getRecipe);

//Enables user to create post w/ cloudinary for media uploads
router.post(
  "/createRecipe",
  upload.single("file"),
  recipesController.createRecipe
);

router.put("/rateRecipe/:id", recipesController.rateRecipe);

router.put("/addIngredient/:id", recipesController.addIngredient);

router.put("/addStep/:id", recipesController.addStep);

router.put("/subtractIngredient/:id", recipesController.subtractIngredient);

router.put("/subtractStep/:id", recipesController.subtractStep);

router.put("/editRecipe/:id", recipesController.editRecipe);

router.put("/editRecipeStatus/:id", recipesController.editRecipeStatus);

router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

module.exports = router;
