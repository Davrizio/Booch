const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const brewsController = require("../controllers/brews");
const { ensureAuth } = require("../middleware/auth");

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, brewsController.getBrew);

//Enables user to create post w/ cloudinary for media uploads
router.post("/createPost", upload.single("file"), brewsController.createBrew);

//Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likePost/:id", brewsController.likeBrew);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deletePost/:id", brewsController.deleteBrew);

module.exports = router;
