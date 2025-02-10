const express = require("express");
const {
  getAllBooks,
  getLimitBooks,
  getOneBook,
  getOneBookTitle,
  getBookGenre,
  getTotalScore,
  getUnreadBooks,
} = require("../controllers/book/getControllers");
const {
  createBook,
  bookImage,
  submitBookRating,
  createUnreadBook,
  submitBookComment,
} = require("../controllers/book/postControllers");
const {
  editBook,
  editBookRating,
  editBookComment,
} = require("../controllers/book/putControllers");
const {
  deleteBook,
  deleteBookComment,
} = require("../controllers/book/deleteControllers");

const checkAuth = require("../middlewares/checkAuth");

const upload = require("../service/upload");
const app = express.Router();

app.route("/").get(getAllBooks).post(checkAuth, createBook);
app.get("/limit/:bookLimit", getLimitBooks);
app.get("/scores", getTotalScore);
app.get("/:bookId", getOneBook);
app.get("/title/:bookTitle", getOneBookTitle);
app.get("/genre/:bookGenre", getBookGenre);
app.get("/unread/all", getUnreadBooks);
app.post("/:bookId", checkAuth, upload.single("picture"), bookImage);
app.post("/rating/:bookId", checkAuth, submitBookRating);
app.post("/comment/:bookId", checkAuth, submitBookComment);
app.post("/unread/create", checkAuth, createUnreadBook);
app.put("/:bookId", checkAuth, editBook);
app.put("/rating/edit/:bookId", checkAuth, editBookRating);
app.put("/comment/edit/:bookId", checkAuth, editBookComment);
app.delete("/:bookId", checkAuth, deleteBook);
app.delete("/comment/delete/:bookId", checkAuth, deleteBookComment);

module.exports = app;
