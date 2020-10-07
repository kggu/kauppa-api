let examplePosting = {
  id: "1",
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
  id: "2",
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
  console.log(posting);

  postings.push(posting);
};

const deletePosting = (id) => {};

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
