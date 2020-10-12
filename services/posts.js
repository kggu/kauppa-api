const utils = require("../utils/getTimeDate");

let postings = [
  {
    id: "0",
    createdBy: "1",
    title: "Test",
    price: 50,
    location: "Oulu",
    description: "testest",
    category: "Pelit",
    images: [],
    delivery: true,
    date: "1900-01-10",
    contact: {
      name: "username",
      email: "ayy@lamo.fi",
    },
  },
  {
    id: "1",
    createdBy: "2",
    title: "Testposting",
    price: 200,
    location: "kemi",
    description: "testest",
    category: "Kellot",
    images: [],
    delivery: true,
    date: "1900-01-10",
    contact: {
      name: "Erkki",
      email: "ayy@lmao.fi",
    },
  },
  {
    id: "2",
    createdBy: "2",
    title: "Kello",
    price: 3000,
    location: "KEMI",
    description: "ranne kELLO",
    category: "Kellot",
    images: [],
    delivery: false,
    date: "1969-4-20",
    contact: {
      name: "Jorma",
      email: "x@ddee.fi",
    },
  },
];

const postConfig = {
  maxImages: 4, // Number of allowed images in post
  validPostingKeys: [
    // Keys that are required when creating a new posting.
    "title",
    "price",
    "location",
    "description",
    "category",
    "delivery",
    //"contact" -> get from req.user
  ],
};

const getAllPosts = (req, res) => {
  res.json(postings);
};

const checkPostOwner = (req, res, next) => {
  let index = postings.findIndex((post) => post.id == req.params.id);

  if (postings[index].createdBy != req.user.id) {
    res.status("403").send("Action forbidden!");
    return;
  }

  next(null, true);
};

const getPost = (req, res) => {
  if (isNaN(req.params.id) || req.params.id < 0) {
    res.status(400).send("Bad ID");
    return;
  }

  let post = postings.find((post) => post.id == req.params.id);
  if (post === undefined) {
    res.status(404).send("Posting not found!");
    return;
  }

  res.status(200).json(post);
};

/*const getTimeDate = () => {
  let date = new Date();
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds()
  );
}; */

const isValidPost = (posting) => {
  console.log(posting);
  // Check if we have all the valid keys. "title" "description" "category" "delivery" "price" "contact"
  if (
    !postConfig.validPostingKeys.every((key) =>
      Object.keys(posting).includes(key)
    )
  ) {
    return false;
  }
  if (posting.price < 0) {
    return false;
  }
  if (posting.title.length === 0 || posting.description.length === 0) {
    return false;
  }

  return true;
};

//TODO: refactor variables.
const newPost = (req, res) => {
  const post = req.body;

  if (!isValidPost(post)) {
    res.status(400).send("Invalid request");
    return;
  }

  try {
    let newPost = {
      id: getLatestId(),
      createdBy: req.user.id,
      title: post.title,
      price: post.price,
      location: post.location,
      description: post.description,
      category: post.category,
      images: [],
      delivery: post.delivery,
      date: utils.getTimeDate(),
      contact: {
        name: req.user.username,
        email: req.user.email,
      },
    };

    postings.push(newPost);
    res.status(201).send("Created new posting!");
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send("something went wrong.");
    return;
  }
};

const addImage = (req, res) => {
  let index = postings.findIndex((post) => post.id == req.params.id);

  if (index == -1) {
    res.status(404).send("Posting not found!");
    return;
  }

  postings[index].images.push(req.images);
  res.status(200).send("Images uploaded!");
};

const getNumberOfImages = (id) => {
  let index = postings.findIndex((post) => post.id == id);
  console.log("posting: ");
  console.log(postings[index]);
  console.log(
    "post " + id + " has " + postings[index].images.length + " images."
  );

  return postings[index].images.length;
};

const getLatestId = () => {
  return postings.length;
};

// TODO: refactor variables.
const deletePost = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  let index = postings.findIndex((post) => post.id == id);

  if (index == -1) {
    res.status(404).send("Posting not found!");
    return;
  }

  try {
    postings.splice(index, 1);
    res.status(200).send("Posting deleted!");
    return;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
};

// TODO:Re-check validation logic.
const editPost = (req, res) => {
  const newPost = req.body;
  const userId = req.user.id;
  const id = req.params.id;

  if (!isValidPost(newPost)) {
    res.status(400).send("Invalid request");
    return;
  }

  let index = postings.findIndex((post) => post.id == req.params.id);
  if (index == -1) {
    res.status(404).send("Posting not found!");
    return;
  }

  try {
    let ogPost = postings[index];
    // Swap allowed keys with new info
    let newPost = {
      id: ogPost.id, // not allowed
      createdBy: ogPost.createdBy, // not allowed
      title: req.body.title ? req.body.title : ogPost.title,
      price: req.body.price ? req.body.price : ogPost.price,
      location: req.body.location ? req.body.location : ogPost.location,
      description: req.body.description
        ? req.body.description
        : ogPost.description,
      category: req.body.category ? req.body.category : ogPost.category,
      images: ogPost.images, // not allowed, use addImage feature.
      delivery: req.body.delivery ? req.body.delivery : ogPost.delivery,
      date: ogPost.date, // not allowed, maybe add last_edited etc.?
      contact: ogPost.contact, // not allowed, tied to user info.
    };

    postings[index] = newPost;
    res.status(200).send("Posting edited!");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
};
// http://localhost:3000/postings/search?location=Oulu&category=Pelit&date=2020-10-13

const searchPosts = (req, res) => {
  let searchParams = req.query;

  console.log(searchParams);

  if (
    searchParams.location === undefined &&
    searchParams.category === undefined &&
    searchParams.date === undefined
  ) {
    res.status(400).send("No search parameters!");
    return;
  }
  // Search case insensetive
  let searchResult = postings.filter((item) => {
    for (let key in searchParams) {
      if (
        item[key] === undefined ||
        item[key].toLowerCase() != searchParams[key].toLowerCase()
      ) {
        return false;
      }
      return true;
    }
  });

  console.log(searchResult);
  if (searchResult.length === 0) {
    res.status(200).send([]);
    return;
  }

  res.status(200).send(searchResult);
};

module.exports = {
  postConfig,
  getAllPosts,
  getPost,
  newPost,
  addImage,
  getNumberOfImages,
  isValidPost,
  deletePost,
  editPost,
  searchPosts,
  checkPostOwner,
};
