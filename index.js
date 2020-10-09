const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const postings = require("./services/postings");
const {
  getAllPostings,
  examplePosting,
  examplePosting2,
} = require("./services/postings");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/postings", (req, res) => {
  let posts = getAllPostings();
  res.json(posts);
});

app.post("/postings", (req, res) => {
  try {
    if (postings.isValidPost(req.body)) {
      postings.newPosting(req.body);
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }

  res.sendStatus(200);
});

app.put("/postings/:id", (req, res) => {
  res.send("Editing post");
});

app.delete("/postings/:id", (req, res) => {
  try {
    postings.deletePosting(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(e);
  }
});

app.get("/postings/:id", (req, res) => {
  console.log("Getting specific id");
  let post = postings.getPosting(req.params.id);
  if (post === undefined) {
    res.send(404);
  }
  res.json(post);
});

app.listen(port, () => {
  postings.newPosting(examplePosting);
  postings.newPosting(examplePosting2);
  console.log(`Example app listening at http://localhost:${port}`);
});
