const { v4: uuidv4 } = require("uuid");

let users = [
  {
    id: 1,
    username: "tester",
    email: "tester@mail.com",
    password: "$2y$06$PhZ74dT8/5g6B8SgssFq6ey4ojLxmP6pos2DcevMUGw25Vc9jGEou", // testerpassword
    validApiKey: null,
  },
  {
    id: 2,
    username: "johndoe",
    email: "john@mail.com",
    password: "$2y$06$eQav1OaIyWSUnlvPSaFXRe5gWRqXd.s9vac1SV1GafxAr8hdmsgCy", // johndoepassword
    validApiKey: null,
  },
];

const usernameExists = (username) => {
  const user = users.find((u) => u.username == username);
  if (user === undefined) {
    return false;
  }
  return true;
};

const getUserByName = (username) => {
  return users.find((u) => u.username == username);
};

const getUserById = (username) => {
  return users.find((u) => u.id == id);
};

const resetApiKey = (userId) => {
  const user = users.find((u) => u.id == userId);
  if (user === undefined) {
    return false;
  }

  user.validApiKey = uuidv4();
  return user.validApiKey;
};

const getApiKey = (userId) => {
  const user = users.find((u) => u.id == userId);
  if (user === undefined) {
    return false;
  }

  return user.validApiKey;
};

const getUserWithApiKey = (apiKey) => {
  return users.find((u) => u.validApiKey == apiKey);
};

const addUser = (username, email, password) => {
  users.push({
    id: uuidv4(),
    username,
    email,
    password,
  });
};

module.exports = {
  addUser,
  getUserById,
  getUserByName,
  usernameExists,
  resetApiKey,
  getApiKey,
  getUserWithApiKey,
};
