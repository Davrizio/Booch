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
        measurements: [],
        steps: [],
        status: "edit",
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
    let result;
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
          ingredients: req.body.ingredient,
          measurements: req.body.measurement,
          steps: [req.body.steps],
          status: req.body.status,
          user: req.user.id,
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
          rating: req.body.rating
        }
      );
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  addIngredient: async (req, res) => {
    let result;
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
          ingredients: req.body.ingredient,
          measurements: req.body.measurement,
          steps: req.body.steps,
          status: "edit",
          user: req.user.id,
          $inc: { ingredientCount: 1 }
        }
      );
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  addStep: async (req, res) => {
    let result;
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
          ingredients: req.body.ingredient,
          measurements: req.body.measurement,
          steps: req.body.steps,
          status: "edit",
          user: req.user.id,
          $inc: { stepCount: 1 }
        }
      );
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  subtractIngredient: async (req, res) => {
    let ingredientList = req.body.ingredient.filter((el,idx,arr) => idx != req.params.num);
    let measurementList = req.body.measurement.filter((el,idx,arr) => idx != req.params.num);
    let result;
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
          ingredients: ingredientList,
          measurements: measurementList,
          steps: req.body.steps,
          status: "edit",
          user: req.user.id,
          $inc: { ingredientCount: -1 }
        }
      );
      res.redirect("back");
    } catch (err) {
      res.redirect("back");
    }
  },
  subtractStep: async (req, res) => {
    let stepsList = req.body.steps.filter((el,idx,arr) => idx != req.params.num);
    let result;
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
          ingredients: req.body.ingredient,
          measurements: req.body.measurement,
          steps: stepsList,
          status: "edit",
          $inc: { stepCount: -1 },
          user: req.user.id,
        }
      );
      res.redirect("back");
    } catch (err) {
      res.redirect("back");
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
