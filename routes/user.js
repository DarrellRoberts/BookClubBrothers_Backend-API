const express = require("express")
const {
  viewOneUserProfile,
  viewAllUserProfile,
  viewOneUserProfileId,
} = require("../controllers/user/getControllers")
const {
  userSignUp,
  resetPasswordUser,
  loginUser,
  uploadUserImage,
} = require("../controllers/user/postControllers")
const {
  editUsername,
  editUserInfo,
} = require("../controllers/user/putControllers")
const { deleteUser } = require("../controllers/user/deleteControllers")

const checkAuth = require("../middlewares/checkAuth")

const upload = require("../service/upload")
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

module.exports = app
