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
    submitBookRating,
    createUnreadBook,
    editBookRating,
    submitBookComment,
    editBookComment,
    getTotalScore
} = require("../controllers/book");

const checkAuth = require("../middlewares/checkAuth")

const upload = require("../service/upload")
const app = express.Router();

app.route("/").get(getAllBooks).post(checkAuth, createBook);
app.get("/scores", getTotalScore)
app.get("/:bookId",getOneBook);
app.get("/title/:bookTitle", getOneBookTitle)
app.get("/genre/:bookGenre", getBookGenre)
app.post("/:bookId", checkAuth, upload.single("picture"), bookImage);
app.put("/:bookId", checkAuth, editBook)
app.post("/rating/:bookId", checkAuth, submitBookRating)
app.put("/rating/edit/:bookId", checkAuth, editBookRating)
app.post("/comment/:bookId", checkAuth, submitBookComment)
app.put("/comment/edit/:bookId", checkAuth, editBookComment)
app.delete("/:bookId", checkAuth, deleteBook);
app.post("/create/unread", checkAuth, createUnreadBook )


module.exports = app;






