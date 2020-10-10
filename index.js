const express = require("express");

const bodyParser = require("body-parser");

const port = 3000;
const app = express();
app.use(bodyParser.json());

const PostService = require("./services/postings");
//const users = require("./services/users");
const auth = require("./services/auth");
const { authBasic } = require("./services/auth");

/* TODO:
  - tests
  - post editing
  - authentication / validation in routes
  - image uploading
  - created_by in posts, so we can validate deletions/editing etc
  - searching
  - proper error responses
  - created_by in posting object
  - proper models for Postings/Users
  - more routes
    /logout

  - move all the logic to their own services.
    only show routes here,
    or split routes in their own files.
*/
//

app.get("/login", authBasic, auth.generateJWT);
app.get("/user", authBasic, (req, res) => {
  res.json(req.user);
});

app.post("/register", auth.registerUser);

app.get("/", (req, res) => {
  res.send("kauppa-api");
});

app.get("/postings", (req, res) => {
  let posts = PostService.getAllPostings();
  res.json(posts);
});

app.post("/postings", authBasic, (req, res) => {
  try {
    if (PostService.isValidPost(req.body)) {
      console.log("creating new...");
      PostService.newPosting(req.body, req.user.id);
    } else {
      res.status(400).send("Invalid request");
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went REALLY wrong.");
    return;
  }

  res.sendStatus(200);
});

app.put("/postings/:id", authBasic, (req, res) => {
  try {
    if (PostService.isValidPost(req.body)) {
      PostService.editPosting(req.params.id);
    } else {
      res.status(400).send("Invalid request");
      return;
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }

  res.sendStatus(200);
});

app.delete("/postings/:id", authBasic, (req, res) => {
  try {
    PostService.deletePosting(req.params.id, req.user.id);
    res.status(200).send("Deleted!");
  } catch (e) {
    console.log(e);
    res.sendStatus(e);
  }
});

app.get("/postings/:id", (req, res) => {
  let post = PostService.getPosting(req.params.id);
  if (post === undefined) {
    res.status(404).send("Posting not found!");
  }
  res.json(post);
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
