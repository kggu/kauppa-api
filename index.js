const env = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const port = 3000;
const app = express();
app.use(bodyParser.json());

const PostService = require("./services/posts");

const auth = require("./services/auth");
const { authBasic } = require("./services/auth");

const imageHandler = require("./services/imageHandler");
const cloudinary = require("./utils/cloudinary");

/* TODO:
  - tests
  - cleanup auth code
  - proper error response codes.
  - complete post validation
  - proper models for Postings/Users
  - move posting contact info to registeraion?
*/

app.get("/", (req, res) => {
  res.send("kauppa-api");
});

app.get("/login", authBasic, (req, res) => {
  res.status(200).send("Logged in!");
});
app.get("/user", authBasic, (req, res) => {
  res.json(req.user);
});

app.post("/register", auth.registerUser);

app.get("/postings", PostService.getAllPosts);

app.post("/postings", authBasic, PostService.newPost);

app.put(
  "/postings/:id",
  authBasic,
  PostService.checkPostOwner,
  PostService.editPost
);

app.post(
  "/postings/:id/upload",
  authBasic,
  PostService.checkPostOwner,
  imageHandler.upload,
  cloudinary.uploadItems,
  PostService.addImage
);

app.delete(
  "/postings/:id",
  authBasic,
  PostService.checkPostOwner,
  PostService.deletePost
);

app.get("/postings/search/", PostService.searchPosts);

app.get("/postings/:id", PostService.getPost);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
