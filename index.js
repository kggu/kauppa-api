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

app.post(
  "/cloudtest",
  authBasic,
  imageUploader.upload,
  cloudinaryService.upload,
  PostService.addImage
);

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

app.post("/postings/:id/upload", authBasic, PostService.addImage);

app.put("/postings/:id", authBasic, PostService.editPosting);

app.delete("/postings/:id", authBasic, PostService.deletePosting);

app.get("/postings/search/", PostService.searchPostings);

app.get("/postings/:id", PostService.getPosting);

app.listen(port, () => {
  console.log(process.env.CLOUDINARY_UPLOAD_PRESET);

  console.log(`Listening at http://localhost:${port}`);
});
