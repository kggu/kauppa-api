let examplePosting = {
  id: "",
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
};

let examplePosting2 = {
  id: "",
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
};

let postings = [];

const getAllPostings = () => {
  console.log("getting all postings.");
  console.log(postings);

  return postings;
};

const getPosting = (id) => {
  console.log("Finding post id: " + id);
  let post = postings.find((post) => post.id == id);
  console.log("found: ");
  console.log(post);

  return post;
};

const newPosting = (posting) => {
  console.log("creating a new posting.");
  console.log("current id:" + findLatestId());
  posting.id = findLatestId();
  //console.log(posting);

  postings.push(posting);
};

const findLatestId = () => {
  return postings.length;
};

const deletePosting = (id) => {
  let index = postings.findIndex((post) => post.id == id);
  if (index == -1) {
    throw 404;
  }
  console.log("deleting: ");
  console.log(postings[index]);
  
  postings.splice(index, 1);
};

const editPosting = (id, newPosting) => {};

module.exports = {
  examplePosting, // debug
  examplePosting2,
  getAllPostings,
  getPosting,
  newPosting,
  deletePosting,
  editPosting,
};
