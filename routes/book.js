const express = require("express");
const {
    createBook,
    getAllBooks,
    getOneBook,
    // editBook,
    deleteBook
} = require("../controllers/book");

const app = express.Router();

app.route("/").get(getAllBooks).post(createBook);
app.get("/:bookId",getOneBook);
// app.put("/:bookId", editBook);
app.delete("/:bookId", deleteBook);

module.exports = app;






