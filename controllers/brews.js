const cloudinary = require("../middleware/cloudinary");
const Brew = require("../models/Brew");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user);
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const brews = await Brew.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { brews: brews, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getBrew: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const post = await Brew.findById(req.params.id);
      res.render("post.ejs", { brew: brew, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createBrew: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content
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
  likeBrew: async (req, res) => {
    try {
      await Brew.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 }
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteBrew: async (req, res) => {
    try {
      // Find post by id
      let post = await Brew.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Brew.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  }
};
