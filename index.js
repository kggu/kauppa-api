const env = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const imageUploader = require("./services/imageUploader");

const cloudinary = require("./services/cloudinary");

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

app.post("/test", authBasic, imageUploader.upload, async (req, res) => {
  req.files.forEach((file) => console.log(file.filename));

  try {
    const author = req.user.id;
    console.log("author: " + author);
    const image = req.files[1];
    console.log(image);

    const response = await cloudinary.uploader.upload(
      "uploads/" + image.filename,
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      }
    );
    console.log(response);
  } catch (e) {
    console.log(e);
  }

  res.send("Files: " + req.files.length);
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

app.post("/postings/:id/upload", authBasic, PostService.addImage);

app.put("/postings/:id", authBasic, PostService.editPosting);

app.delete("/postings/:id", authBasic, PostService.deletePosting);

app.get("/postings/search/", PostService.searchPostings);

app.get("/postings/:id", PostService.getPosting);

app.listen(port, () => {
  console.log(process.env.CLOUDINARY_UPLOAD_PRESET);

  console.log(`Listening at http://localhost:${port}`);
});
