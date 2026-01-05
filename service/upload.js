import { createRequire } from "module"
const require = createRequire(import.meta.url)

import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

// Load the library
const multerStorage = require("multer-storage-cloudinary")

// FORCE find the constructor
// Sometimes it is multerStorage, sometimes multerStorage.CloudinaryStorage
const CloudinaryStorage = multerStorage.CloudinaryStorage || multerStorage

console.log("Debug - Type of CloudinaryStorage:", typeof CloudinaryStorage)

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "app",
    allowed_formats: ["jpeg", "jpg", "png", "svg", "webp"],
  },
})

const upload = multer({ storage: storage })
export default upload
