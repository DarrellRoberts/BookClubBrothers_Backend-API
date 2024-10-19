const express = require("express");
const {
    userSignUp,
    resetPasswordUser,
    loginUser,
    logoutUser,
    viewOneUserProfile,
    viewAllUserProfile,
    uploadUserImage,
    deleteUser,
    editUsername,
    editUserInfo
} = require("../controllers/user");

const checkAuth = require("../middlewares/checkAuth")

const upload = require("../service/upload")
const app = express.Router();

app.route("/").get(viewAllUserProfile)
app.post("/signup", userSignUp) 
app.post("/login", loginUser)
app.put("/logout", checkAuth, logoutUser)
app.get("/:username",viewOneUserProfile);
app.get("/:username/reset_password", resetPasswordUser)
app.post("/upload/:userId", checkAuth, upload.single("avatar"), uploadUserImage);
app.delete("/:userId", checkAuth, deleteUser);
app.put("/username/:userId", checkAuth, editUsername)
app.put("/:userId", checkAuth, editUserInfo)

module.exports = app;






