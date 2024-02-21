const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const recipesController = require("../controllers/recipes");
const { ensureAuth } = require("../middleware/auth");

router.get("/:id", ensureAuth, recipesController.getRecipe);

router.post(
  "/createRecipe",
  upload.single("file"),
  recipesController.createRecipe
);

router.put("/rateRecipe/:id", recipesController.rateRecipe);

router.put("/addIngredient/:id", recipesController.addIngredient);

router.put("/addStep/:id", recipesController.addStep);

router.put("/subtractIngredient/:id/:num", recipesController.subtractIngredient);

router.put("/subtractStep/:id/:num", recipesController.subtractStep);

router.put("/editRecipe/:id", recipesController.editRecipe);

router.post("/editPicture/:id", upload.single("file"), recipesController.editPicture);

router.put("/editRecipeStatus/:id", recipesController.editRecipeStatus);

router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

module.exports = router;
