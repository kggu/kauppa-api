const env = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

const PostService = require("./services/posts");

const auth = require("./services/auth");

const imageHandler = require("./services/imageHandler");
const cloudinary = require("./utils/cloudinary");

/* TODO:
  - tests
  - implement JWT sessions
  - proper models for Postings/Users
*/

app.get("/", (req, res) => {
  res.send("kauppa-api");
});

app.get("/login", auth.basic, (req, res) => {
  res.status(200).send("Logged in!");
});
app.get("/user", auth.basic, (req, res) => {
  res.json(req.user);
});

app.post("/register", auth.registerUser);

app.get("/postings", PostService.getAllPosts);

app.post("/postings", auth.basic, PostService.newPost);

app.put(
  "/postings/:id",
  auth.basic,
  PostService.checkPostOwner,
  PostService.editPost
);

app.post(
  "/postings/:id/upload",
  auth.basic,
  PostService.checkPostOwner,
  imageHandler.upload,
  cloudinary.uploadItems,
  PostService.addImage
);

app.delete(
  "/postings/:id",
  auth.basic,
  PostService.checkPostOwner,
  PostService.deletePost
);

app.get("/postings/search/", PostService.searchPosts);

app.get("/postings/:id", PostService.getPost);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
