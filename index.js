const env = require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./reference/api-docs.json");

const PostService = require("./services/posts");
const auth = require("./services/auth");
const localFiles = require("./services/localFiles");
const cloudinary = require("./utils/cloudinary");

app.get("/", (req, res) => {
  res.send("kauppa-api, documentation is at /docs");
});

app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(swaggerDocument));

app.get("/login", auth.basic, (req, res) => {
  res.status(200).send("Logged in!");
});

app.post("/register", auth.registerUser);

app.get("/postings", PostService.getAllPosts);

app.post("/postings", auth.basic, PostService.newPost);

app.get("/postings/search/", PostService.searchPosts);

app.get("/postings/:id", PostService.getPost);

app.put(
  "/postings/:id",
  auth.basic,
  PostService.checkPostOwner,
  PostService.editPost
);

app.delete(
  "/postings/:id",
  auth.basic,
  PostService.checkPostOwner,
  PostService.deletePost
);

app.post(
  "/postings/:id/upload",
  auth.basic,
  PostService.checkPostOwner,
  localFiles.upload,
  cloudinary.uploadItems,
  PostService.addImage
);



app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
