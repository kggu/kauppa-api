const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());


const PostService = require("./services/postings");

/* TODO:
  - post editing
  - authentication / validation in routes
  - image uploading
  - created_by in posts, so we can validate deletions/editing etc
  - searching
*/

app.get("/", (req, res) => {
  res.send("kauppa-api");
});

app.get("/postings", (req, res) => {
  let posts = PostService.getAllPostings();
  res.json(posts);
});

app.post("/postings", (req, res) => {
  try {
    if (PostService.isValidPost(req.body)) {
      console.log("creating new...");
      PostService.newPosting(req.body);
    } else {
      res.sendStatus(400);
      return;
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }

  res.sendStatus(200);
});

app.put("/postings/:id", (req, res) => {
  res.send("Editing post");
});

app.delete("/postings/:id", (req, res) => {
  try {
    PostService.deletePosting(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(e);
  }
});

app.get("/postings/:id", (req, res) => {
  console.log("Getting specific id");
  let post = PostService.getPosting(req.params.id);
  if (post === undefined) {
    res.send(404);
  }
  res.json(post);
});

app.listen(port, () => {
  PostService.newPosting(PostService.examplePosting);
  PostService.newPosting(PostService.examplePosting2);
  console.log(`Example app listening at http://localhost:${port}`);
});
