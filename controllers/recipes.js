const cloudinary = require("../middleware/cloudinary");
const Brew = require("../models/Brew");
const Recipe = require("../models/Recipe");
const fs = require("fs");

module.exports = {
  getRecipes: async (req, res) => {
    try {
      const recipe = await Recipe.find({ user: req.user.id });
      res.render("recipes.ejs", { recipe: recipe, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      res.render("recipe.ejs", { recipe: recipe, user: req.user });
      console.log(recipe);
    } catch (err) {
      console.log(err);
    }
  },
  createRecipe: async (req, res) => {
    let result;
    try {
      if (req.file === undefined) {
        result = await cloudinary.uploader.upload(
          "./public/imgs/default_recipe.png"
        );
      } else {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        note: " ",
        rating: 0,
        ingredientCount: 1,
        stepCount: 1,
        ingredients: [],
        steps: [],
        status: "new",
        user: req.user.id
      });
      console.log("Recipe card has been added!");
      res.redirect("/recipes");
    } catch (err) {
      console.log(err);
    }
  },
  editRecipe: async (req, res) => {
    console.log(req.body);
    try {
      if (req.file === undefined) {
        result = await cloudinary.uploader.upload(
          "./public/imgs/default_recipe.png"
        );
      } else {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          note: req.body.note,
          rating: 0,
          ingredients: [req.body.ingredient, req.body.measurement],
          steps: [req.body.steps],
          status: req.body.status,
          user: req.user.id
        }
      );
      console.log("Recipe has been updated!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  editRecipeStatus: async (req, res) => {
    console.log(req.body);
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          status: req.body.status
        }
      );
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
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  addStep: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { stepCount: 1 }
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
  subtractStep: async (req, res) => {
    try {
      await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { stepCount: -1 }
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
