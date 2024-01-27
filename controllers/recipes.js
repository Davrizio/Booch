const cloudinary = require("../middleware/cloudinary");
const Brew = require("../models/Brew");
const Recipe = require("../models/Recipe");

module.exports = {
  getRecipes: async (req, res) => {
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const recipe = await Recipe.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      res.render("recipes.ejs", { recipe: recipe, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getRecipe: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const recipe = await Recipe.findById(req.params.id);
      res.render("recipe.ejs", { recipe: recipe, user: req.user });
      console.log(recipe);
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content
      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        note: " ",
        rating: 0,
        ingredientCount: 1,
        instructionCount: 1,
        ingredients: [],
        steps: [],
        status: "new",
        user: req.user.id
      });
      console.log("Brew card has been added!");
      res.redirect("/recipes");
    } catch (err) {
      console.log(err);
    }
  },
  updateRecipe: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);

      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        note: req.body.note,
        rating: 0,
        ingredientCount: 0,
        instructionCount: 0,
        ingredients: [req.body.ingredients, req.body.measurement],
        steps: [req.body.steps],
        user: req.user.id
      });
      console.log("Recipe has been updated!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  rateRecipe: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { rating: 1 }
        }
      );
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  addIngredient: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { ingredientCount: 1 }
        }
      );
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  addInstruction: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { instructionCount: 1 }
        }
      );
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  subtractIngredient: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { ingredientCount: -1 }
        }
      );
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      res.redirect(`/recipe/${req.params.id}`);
    }
  },
  subtractInstruction: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { instructionCount: -1 }
        }
      );
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      res.redirect(`/recipe/${req.params.id}`);
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find post by id
      let post = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Recipe.remove({ _id: req.params.id });
      console.log("Deleted Recipe");
      res.redirect("/recipes");
    } catch (err) {
      res.redirect("/recipes");
    }
  }
};
