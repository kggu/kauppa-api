const uploader = require("./imageUploader");

let postings = [
  {
    id: "0",
    createdBy: "1",
    title: "Test",
    price: 50,
    location: "Oulu",
    description: "testest",
    category: "Pelit",
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
    location: "Kemi",
    description: "testest",
    category: "Kaikki",
    images: [{ url: "" }],
    delivery: true,
    date: "1900-01-10",
    contact: {
      name: "Erkki",
      phone: "+3458232312",
      address: "Tuomiontie 666",
    },
  },
  {
    id: "2",
    createdBy: "2",
    title: "Kello",
    price: 3000,
    location: "Kemi",
    description: "ranne kELLO",
    category: "Kellot",
    images: [{ url: "" }],
    delivery: false,
    date: "1969-4-20",
    contact: {
      name: "Jorma",
      phone: "+34582342423",
      address: "Jokukatu 23",
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
  "location",
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
      location: posting.location,
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

const addImage = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  let index = postings.findIndex((post) => post.id == id);

  if (index == -1) {
    res.status(404).send("Posting not found!");
    return;
  }
  if (postings[index].createdBy != userId) {
    res.status("403").send("Uploading forbidden!");
    return;
  }
};

const getLatestId = () => {
  return postings.length;
};

// TODO: refactor variables.
const deletePosting = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  console.log("id: " + id + " |userId: " + userId);

  let index = postings.findIndex((post) => post.id == id);

  if (index == -1) {
    res.status(404).send("Posting not found!");
    return;
  }
  if (postings[index].createdBy != userId) {
    res.status("403").send("Deletion forbidden!");
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
    res.status(200).send("Posting edited!");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
    return;
  }
};
// http://localhost:3000/postings/search?location=Oulu&category=Pelit&date=2020-10-13

const searchPostings = (req, res) => {
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

  let searchResult = postings.filter((item) => {
    for (let key in searchParams) {
      if (item[key] === undefined || item[key] != searchParams[key]) {
        return false;
      }
      return true;
    }
  });

  console.log(searchResult);
  if (searchResult.length === 0) {
    res.status(200).send("No results found!");
    return;
  }

  res.status(200).send(searchResult);
};

module.exports = {
  getAllPostings,
  getPosting,
  newPosting,
  addImage,
  isValidPost,
  deletePosting,
  editPosting,
  searchPostings,
};
