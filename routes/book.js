const express = require("express");
const {
    createBook,
    getAllBooks,
    getOneBook,
    editBook,
    deleteBook,
    bookImage
} = require("../controllers/book");

const upload = require("../service/upload")
const app = express.Router();

app.route("/").get(getAllBooks).post(createBook);
app.get("/:bookId",getOneBook);
app.post("/:bookId", upload.single("picture"), bookImage);
app.put("/:bookId", editBook)
app.delete("/:bookId", deleteBook);

module.exports = app;






