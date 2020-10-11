const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = "uploads/" + req.user.id;
    // Create each user their own temp dir, so we don't accidentally clear user files mid-upload
    if (!fs.existsSync(userDir)) {
      console.log("creating user dir " + userDir);
      fs.mkdirSync(userDir);
    }

    cb(null, userDir);
  },
  // By default, multer removes file extensions
  filename: function (req, file, cb) {
    cb(
      null,
      req.user.id +
        "-" +
        req.user.username +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(400, false);
  }
};

let upload = multer({
  storage: storage,
  fileFilter: multerFilter,
}).array("image", 4);

module.exports = {
  upload,
};
