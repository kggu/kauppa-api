const bcrypt = require("bcryptjs");
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const users = require("./users");

// JWT --
const jwtSecretKey = process.env.JWT_SECRET_KEY
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
let options = {};
// --

passport.use(
  new BasicStrategy(function (username, password, done) {
    const user = users.getUserByName(username);
    if (user == undefined) {
      // Username not found
      console.log("HTTP Basic username not found");
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match */
    if (bcrypt.compareSync(password, user.password) == false) {
      // Password does not match
      console.log("HTTP Basic password not matching username");
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  })
);

const basic = passport.authenticate("basic", { session: false });

// JWT currently not used. maybe implement this later.
/* Configure the passport-jwt module to expect JWT
   in headers from Authorization field as Bearer token */
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = jwtSecretKey;

const registerUser = (req, res) => {
  if ("username" in req.body == false) {
    res.status(400).send("Missing username from body");
    return;
  }
  if ("password" in req.body == false) {
    res.status(400).send("Missing password from body");
    return;
  }
  if ("email" in req.body == false) {
    res.status(400).send("Missing email from body");
    return;
  }

  if (users.usernameExists(req.body.username)) {
    res.status(400).send("Username already exists!");
    return;
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 6);
  console.log("pw: " + hashedPassword);
  users.addUser(req.body.username, req.body.email, hashedPassword);

  res.status(201).send("Created");
};

const generateJWT = (req, res) => {
  const body = {
    id: req.user.id,
    email: req.user.email,
  };

  const payload = {
    user: body,
  };

  const options = {
    expiresIn: "1d",
  };

  /* Sign the token with payload, key and options.
       Detailed documentation of the signing here:
       https://github.com/auth0/node-jsonwebtoken#readme */
  const token = jwt.sign(payload, jwtSecretKey, options);

  return res.json({ token });
};

module.exports = {
  basic,
  generateJWT,
  registerUser,
};
