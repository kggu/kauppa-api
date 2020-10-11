const express = require("express");
const bodyParser = require("body-parser");

const multer = require("multer");
const path = require("path");

const port = 3000;
const app = express();
app.use(bodyParser.json());

const PostService = require("./services/postings");
const auth = require("./services/auth");
const { authBasic } = require("./services/auth");

/* TODO:
  - tests
  - image uploading
  - cleanup auth code
  - proper error response codes.
  - complete post validation
  - proper models for Postings/Users
  - move posting contact info to registeraion?
  - uninstall non-required packages etc. cleanup.
  - more routes
    /logout
*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  // By default, multer removes file extensions
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload an image.", 400), false);
  }
};

app.post("/multi", (req, res) => {
  let upload = multer({
    storage: storage,
    fileFilter: multerFilter,
  }).array("image", 4);

  upload(req, res, function (err) {
    const files = req.files;
    let index, len;
    console.log(files.length);
    let result = "Uploaded " + files.length + " images.";

    res.send(result);
  });
});

app.get("/", (req, res) => {
  res.send("kauppa-api");
});

app.get("/login", authBasic, auth.generateJWT);
app.get("/user", authBasic, (req, res) => {
  res.json(req.user);
});

app.post("/register", auth.registerUser);

app.get("/postings", PostService.getAllPostings);

app.post("/postings", authBasic, PostService.newPosting);

app.put("/postings/:id", authBasic, PostService.editPosting);

app.delete("/postings/:id", authBasic, PostService.deletePosting);

app.get("/postings/search/", PostService.searchPostings);

app.get("/postings/:id", PostService.getPosting);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
