const cloudinary = require("../middleware/cloudinary");
const Brew = require("../models/Brew");
const Recipe = require("../models/Recipe");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user)
    try {
      const recipe = await Recipe.find({ user: req.user.id })
      const brews = await Brew.find({ user: req.user.id });
      res.render("profile.ejs", { brews: brews, recipe: recipe, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getBrew: async (req, res) => {
    try {
      const recipe = await Recipe.find({ user: req.user.id })
      const brew = await Brew.findById(req.params.id);
      res.render("brew.ejs", { brew: brew, recipe: recipe, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createBrew: async (req, res) => {
    let result;
    try {
      if (req.file === undefined) {
        result = await cloudinary.uploader.upload(
          "./public/imgs/default_brew.png"
        );
      } else {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      await Brew.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        note: req.body.note,
        rating: 0,
        firstFerment: req.body.firstFerment,
        secondFerment: '',
        thirdFerment: '',
        tea: req.body.tea,
        avgTemp: req.body.avgTemp,
        user: req.user.id
      });
      console.log("Brew card has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  createBrew: async (req, res) => {
    let result;
    try {
      if (req.file === undefined) {
        result = await cloudinary.uploader.upload(
          "./public/imgs/default_brew.png"
        );
      } else {
        result = await cloudinary.uploader.upload(req.file.path);
      }
      await Brew.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        note: req.body.note,
        rating: 0,
        firstFerment: req.body.firstFerment,
        secondFerment: req.body.secondFerment,
        thirdFerment: req.body.thirdFerment,
        tea: req.body.tea,
        avgTemp: req.body.avgTemp,
        user: req.user.id
      });
      console.log("Brew card has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  rateBrew: async (req, res) => {
    console.log("here!");
    try {
      await Brew.findOneAndUpdate(
        { _id: req.params.id },
        {
          rating: req.body.rating
        }
      );
      console.log("Likes +1");
      res.redirect(`/brew/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteBrew: async (req, res) => {
    try {
      let post = await Brew.findById({ _id: req.params.id });
      await cloudinary.uploader.destroy(post.cloudinaryId);
      await Brew.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  }
};
