const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();
const DB = process.env.DATABASE;
const storage = new GridFsStorage({
  url: DB,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = `SansHerbal_${buf.toString("hex")}_${
          file.originalname
        }`;
        const fileInfo = {
          filename: filename,
          bucketName: "photos",
        };
        resolve(fileInfo);
      });
    });
  },
});
const store = multer({
  storage,
  limits: { fileSize: 20000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb("filetype");
};
const load = (upload, req, res, next) => {
  return upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(400).send("File too large");
    } else if (err) {
      console.log(err);
      if (err === "filetype") return res.status(400).send("Image files only");
      return res.sendStatus(500);
    }
    next();
  });
};
const up_s = (req, res, next) => {
  load(store.single("image"), req, res, next);
};
const up_m = (req, res, next) => {
  load(store.array("image", 10), req, res, next);
};

module.exports = { up_s, up_m };
