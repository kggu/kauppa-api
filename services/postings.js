let postings = [
  {
    id: "0",
    createdBy: "1",
    title: "Test",
    price: 50,
    description: "testest",
    category: "All",
    images: [{ url: "" }],
    delivery: true,
    date: "1900-01-10",
    contact: {
      name: "a",
      phone: "040404040",
      address: "TT 12",
    },
  },
  {
    id: "1",
    createdBy: "2",
    title: "Testposting",
    price: 200,
    description: "testest",
    category: "All",
    images: [{ url: "" }],
    delivery: true,
    date: "1900-01-10",
    contact: {
      name: "Erkki",
      phone: "+3458232312",
      address: "Tuomiontie 666",
    },
  },
];

// Keys that are required when creating a new posting.
// Images are optional
const validPostingKeys = [
  "title",
  "description",
  "category",
  "delivery",
  "price",
  "contact",
];

const getAllPostings = (req, res) => {
  res.json(postings);
};

const getPosting = (req, res) => {
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

const getTimeDate = () => {
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
};

const isValidPost = (posting) => {
  console.log("validating");
  console.log(posting);
  // Check if we have all the valid keys. "title" "description" "category" "delivery" "price" "contact"
  if (!validPostingKeys.every((key) => Object.keys(posting).includes(key))) {
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
const newPosting = (req, res) => {
  const posting = req.body;
  const userId = req.user.id;

  if (!isValidPost(posting)) {
    res.status(400).send("Invalid request");
    return;
  }

  try {
    let newPosting = {
      id: getLatestId(),
      createdBy: userId ? userId : null,
      title: posting.title,
      price: posting.price,
      description: posting.description,
      category: posting.category,
      images: posting.images,
      delivery: posting.delivery,
      date: getTimeDate(),
      contact: posting.contact,
    };

    console.log("creating post id:" + getLatestId() + " | " + newPosting.title);
    postings.push(newPosting);
    res.status(200).send("Created new posting!");
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send("something went wrong!!!111");
    return;
  }
};

const getLatestId = () => {
  return postings.length;
};

// Change this later on, current error handling is total spaghetti.
const deletePosting = (id, userId) => {
  console.log("id: " + id + " |userId: " + userId);
  let index = postings.findIndex((post) => post.id == id);
  if (index == -1) {
    throw 404;
  }
  if (postings[index].createdBy != userId) {
    console.log("Forbidden deletion");
    throw 403;
  }
  console.log("deleting: ");
  console.log(postings[index]);

  postings.splice(index, 1);
};

//TODO: refactor variables.
//Refine editing logic:
// -> check for json keys, don't allow id,date,createdBy editing.
const editPosting = (req, res) => {
  const newPosting = req.body;
  const userId = req.user.id;
  const id = req.params.id;

  if (!isValidPost(newPosting)) {
    res.status(400).send("Invalid request");
    return;
  }

  let index = postings.findIndex((post) => post.id == id);

  if (index == -1) {
    res.status(404).send("Posting not found!");
    return;
  }
  if (postings[index].createdBy != userId) {
    res.status("403").send("Editing forbidden!");
    return;
  }

  try {
    postings[index] = newPosting;
    res.status(200).send("Posting edited!")
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
};

const searchPostings = (date, location, category) => {
  console.log(
    "searching | date: " +
      date +
      " | location: " +
      location +
      " | category: " +
      category
  );

  let result = [];
};

module.exports = {
  getAllPostings,
  getPosting,
  newPosting,
  isValidPost,
  deletePosting,
  editPosting,
  searchPostings,
};
