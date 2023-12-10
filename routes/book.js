const express = require("express");
const {
    createBook,
    getAllBooks,
    getOneBook,
    editBook,
    deleteBook,
    bookImage,
    getOneBookTitle,
    getBookGenre,
    submitBookRating
} = require("../controllers/book");

const checkAuth = require("../middlewares/checkAuth")

const upload = require("../service/upload")
const app = express.Router();

app.route("/").get(getAllBooks).post(checkAuth, createBook);
app.get("/:bookId",getOneBook);
app.get("/title/:bookTitle", getOneBookTitle)
app.get("/genre/:bookGenre", getBookGenre)
app.post("/:bookId", checkAuth, upload.single("picture"), bookImage);
app.put("/:bookId", checkAuth, editBook)
app.post("/rating/:bookId", checkAuth, submitBookRating)
app.delete("/:bookId", checkAuth, deleteBook);

module.exports = app;






