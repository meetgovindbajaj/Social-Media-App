const asyncHandler = require("express-async-handler");
const genRes = require("../utils/generateResponse");
const { deleteImage } = require("../utils/gridFs");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");

// @image --ENV_Configuration
require("dotenv").config();
const DB = process.env.DATABASE;

// @image --GridFS_Configuration
Grid.mongo = mongoose.mongo;
let gfs;
const conn = mongoose.createConnection(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos",
  });
});

// @image --uploadImage_s : upload single image
const uploadImage_s = asyncHandler(async (req, res) => {
  try {
    const { file } = req;
    const { id } = file;
    if (file.size > 5000000) {
      deleteImage(id);
      return res
        .status(200)
        .json(genRes(413, true, "Image must not exceed 5mb"));
    }
    return res.status(200).json(genRes(200, false, "Success", file.id));
  } catch (error) {
    return res.status(200).json(genRes(409, true, "Error uploading file"));
  }
});

// @image --renderImage : render image through pipeline
const renderImage = asyncHandler(async ({ params: { id } }, res) => {
  try {
    if (!id || id === "undefined")
      return res.status(404).json(genRes(404, true, "Not Found"));
    const _id = new mongoose.Types.ObjectId(id);
    gfs.find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0)
        return res.status(404).json(genRes(404, true, "Not Found"));
      gfs.openDownloadStream(_id).pipe(res);
    });
  } catch (error) {
    return res.status(404).json(genRes(404, true, "Not Found"));
  }
});

// @image --delImage : delete an image
const delImage = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "undefined")
      return res.status(200).json(genRes(404, true, "Not Found"));
    const _id = new mongoose.Types.ObjectId(req.params.id);
    gfs.delete(_id, (err) => {
      if (err) res.status(200).json(genRes(500, true, "Internal Server Error"));
      else return res.status(200).json(genRes());
    });
  } catch (error) {
    res.status(200).json(genRes(500, true, "Internal Server Error"));
  }
});

module.exports = { uploadImage_s, renderImage, delImage };
