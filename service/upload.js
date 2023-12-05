const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "app",
  allowedFormats: ["jpeg", "jpg", "png", "svg"],
  transformation: [{width: 500, height: 500, crop: "limit"}]
});

// Test the Cloudinary connection by uploading an image
// const testCloudinaryConnection = async () => {
//     try {
//       const result = await cloudinary.uploader.upload('path/to/your/test/image.jpg');
//       console.log('Cloudinary upload result:', result);
//     } catch (error) {
//       console.error('Cloudinary upload error:', error);
//     }
//   };
//   // Run the test function
//   testCloudinaryConnection();

const upload = multer({ storage: storage });
// console.log("upload", storage);

module.exports = upload;