const cloudinary = require("cloudinary").v2;
const cleanup = require("./cleanup");
const { getNumberOfImages, postConfig } = require("../services/posts");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadItems = async (req, res, next) => {
  req.files.forEach((file) => console.log(file.path));

  const numberOfImages = getNumberOfImages(req.params.id);
  if (numberOfImages + req.files.length >= postConfig.maxImages) {
    cleanup.clearDirectoryWithInterval(0, req.user.id);
    console.log(postConfig.maxImages);
    console.log(numberOfImages);
    res
      .status(400)
      .send(postConfig.maxImages - numberOfImages + " more can be uploaded.");
    return;
  }

  let uploadedImages = [];
  try {
    for (const file of req.files) {
      const response = await cloudinary.uploader.upload(file.path, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });

      console.log(response);

      let imageObject = {
        url: response.secure_url,
      };

      uploadedImages.push(imageObject);
    }
  } catch (e) {
    console.log(e);
    cleanup.clearDirectoryWithInterval(0, req.user.id);
    res.status(500).send("Something went wrong: " + e);
    return;
  }

  if (uploadedImages.length === 0) {
    res.status(500).send("No images were uploaded.");
    return;
  }
  console.log(uploadedImages);
  // Save images to request object, so PostService can save them to post object.
  req.images = uploadedImages;
  // Clean user images from temp storage.
  cleanup.clearDirectoryWithInterval(0, req.user.id);

  next(null, true);
};

module.exports = {
  uploadItems,
};
