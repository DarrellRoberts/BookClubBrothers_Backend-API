const express = require("express");
const {
    createBook,
    getAllBooks,
    getOneBook,
    editBook,
    deleteBook,
    bookImage,
    getOneBookTitle,
    getBookGenre
} = require("../controllers/book");

const upload = require("../service/upload")
const app = express.Router();

app.route("/").get(getAllBooks).post(createBook);
app.get("/:bookId",getOneBook);
app.get("/title/:bookTitle", getOneBookTitle)
app.get("/genre/:bookGenre", getBookGenre)
app.post("/:bookId", upload.single("picture"), bookImage);
app.put("/:bookId", editBook)
app.delete("/:bookId", deleteBook);

module.exports = app;






