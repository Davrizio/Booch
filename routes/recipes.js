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

//Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/rateRecipe/:id", recipesController.rateRecipe);

router.put("/addIngredient/:id", recipesController.addIngredient);

router.put("/addInstruction/:id", recipesController.addInstruction);

router.put("/subtractIngredient/:id", recipesController.subtractIngredient);

router.put("/subtractInstruction/:id", recipesController.subtractInstruction);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

module.exports = router;
