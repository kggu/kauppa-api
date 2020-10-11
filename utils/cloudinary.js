const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadItems = async (req, res, next) => {
  req.files.forEach((file) => console.log(file.path));

  let uploadedImages = [];
  try {
    for (const file of req.files) {

      const response = await cloudinary.uploader.upload(
        file.path,
        {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        }
      );

      console.log(response);

      let imageObject = {
        url: response.secure_url,
      };

      uploadedImages.push(imageObject);
    }
  } catch (e) {
    console.log(e);
    next(500, false);
  }

  console.log(uploadedImages);
  req.images = uploadedImages;
  next(null, true);
};

module.exports = {
  uploadItems,
};
