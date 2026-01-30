import "dotenv/config"
import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

if (!process.env.API_KEY) {
  console.error(
    "DEBUG: process.env.API_KEY is missing! Current keys:",
    Object.keys(process.env).filter(
      (k) => k.includes("API") || k.includes("CLOUD"),
    ),
  )
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const customCloudinaryStorage = {
  _handleFile: (req: any, file: Express.Multer.File, cb: any) => {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    })

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "app",
        allowed_formats: ["jpeg", "jpg", "png", "svg", "webp"],
      },
      (error, result) => {
        if (error) return cb(error)
        cb(null, {
          path: result?.secure_url,
          filename: result?.public_id,
        })
      },
    )

    file.stream.pipe(stream)
  },
  _removeFile: (req: any, file: any, cb: any) => {
    cloudinary.uploader.destroy(file.filename, cb)
  },
}

const upload = multer({ storage: customCloudinaryStorage })
export default upload
