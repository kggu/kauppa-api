const env = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const imageUploader = require("./services/imageUploader");
const cloudinaryUploader = require("./services/cloudinary");

const cloudinary = require("./services/cloudinary");

const port = 3000;
const app = express();
app.use(bodyParser.json());

const PostService = require("./services/postings");
const auth = require("./services/auth");
const { authBasic } = require("./services/auth");
const cloudinaryService = require("./services/cloudinary");
const { checkPostingOwner } = require("./services/postings");

/* TODO:
  - tests
  - local cleanup for images
  - cleanup auth code
  - proper error response codes.
  - complete post validation
  - proper models for Postings/Users
  - move posting contact info to registeraion?
  - uninstall non-required packages etc. cleanup.
  - more routes
    /logout
*/

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

app.put("/postings/:id", authBasic, checkPostingOwner, PostService.editPosting);

app.post(
  "/postings/:id/upload",
  authBasic,
  PostService.checkPostingOwner,
  imageUploader.upload,
  cloudinaryService.upload,
  PostService.addImage
);

app.delete(
  "/postings/:id",
  authBasic,
  PostService.checkPostingOwner,
  PostService.deletePosting
);

app.get("/postings/search/", PostService.searchPostings);

app.get("/postings/:id", PostService.getPosting);

app.listen(port, () => {
  console.log(process.env.CLOUDINARY_UPLOAD_PRESET);

  console.log(`Listening at http://localhost:${port}`);
});
