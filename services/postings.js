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

const getAllPostings = () => {
  return postings;
};

const getPosting = (id) => {
  let post = postings.find((post) => post.id == id);
  //console.log(post);

  return post;
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

const newPosting = (posting, userId) => {
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

  console.log("current id:" + getLatestId());

  postings.push(newPosting);
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

const editPosting = (id, newPosting, userId) => {
  console.log("editing id: " + id);
  let index = postings.findIndex((post) => post.id == id);
  if (index == -1) {
    return;
  }
  if (postings[index].createdBy != userId) {
    throw 403;
  }
  postings[index] = newPosting;
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
