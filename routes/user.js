const express = require("express");
const {
    userSignUp,
    resetPasswordUser,
    loginUser,
    viewOneUserProfile,
    viewAllUserProfile,
    uploadUserImage,
    deleteUser
} = require("../controllers/user");

const checkAuth = require("../middlewares/checkAuth")

const upload = require("../service/upload")
const app = express.Router();

app.route("/").get(viewAllUserProfile)
app.post("/signup", userSignUp) 
app.post("/login", loginUser)
app.get("/:username",viewOneUserProfile);
app.get("/:username/reset_password", resetPasswordUser)
app.post("/:userId", checkAuth, upload.single("avatar"), uploadUserImage);
app.delete("/:userId", checkAuth, deleteUser);

module.exports = app;






