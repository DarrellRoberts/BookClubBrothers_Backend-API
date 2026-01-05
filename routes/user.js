import express from "express"

// Remember: ES Modules require the file extension (e.g., .js)
import {
  viewOneUserProfile,
  viewAllUserProfile,
  viewOneUserProfileId,
} from "../controllers/user/getControllers.js"

import {
  userSignUp,
  resetPasswordUser,
  loginUser,
  uploadUserImage,
} from "../controllers/user/postControllers.js"

import {
  editUsername,
  editUserInfo,
} from "../controllers/user/putControllers.js"

import { deleteUser } from "../controllers/user/deleteControllers.js"

import checkAuth from "../middlewares/checkAuth.js"
import upload from "../service/upload.js"

const app = express.Router()

app.route("/").get(viewAllUserProfile)
app.get("/id/:id", viewOneUserProfileId)
app.get("/:username", viewOneUserProfile)
app.get("/:username/reset_password", resetPasswordUser)
app.post("/signup", userSignUp)
app.post("/login", loginUser)
app.post("/upload/:userId", checkAuth, upload.single("avatar"), uploadUserImage)
app.put("/username/:userId", checkAuth, editUsername)
app.put("/:userId", checkAuth, editUserInfo)
app.delete("/:userId", checkAuth, deleteUser)

export default app
