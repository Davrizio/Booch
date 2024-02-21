const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const brewsController = require("../controllers/brews");
const { ensureAuth } = require("../middleware/auth");

router.get("/:id", ensureAuth, brewsController.getBrew);

router.post("/createBrew", upload.single("file"), brewsController.createBrew);

router.post("/editPicture/:id", upload.single("file"), brewsController.editPicture);

router.put("/rateBrew/:id", brewsController.rateBrew);

router.put("/editBrew/:id", brewsController.editBrew);

router.delete("/deleteBrew/:id", brewsController.deleteBrew);

module.exports = router;
