const express = require("express");
const {
  uploadImage_s,
  renderImage,
  delImage,
} = require("../controllers/image_controller");
const { up_s } = require("../middlewares/upload");
const router = express.Router();

// @image --Upload_Single_Image
router.route("/u_s").post(up_s, uploadImage_s);

// @image --Render_Image --Delete_Image
router.route("/:id").get(renderImage).delete(delImage);

module.exports = router;
