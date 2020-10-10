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
  - image uploading
  - searching
  - cleanup auth code
  - proper models for Postings/Users
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

app.put("/postings/:id", authBasic, PostService.editPosting);

app.delete("/postings/:id", authBasic, PostService.deletePosting);

app.get("/postings/:id", PostService.getPosting);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
