import express from "express"
import {
  getAllBooks,
  getLimitBooks,
  getOneBook,
  getOneBookTitle,
  getBookGenre,
  getTotalScore,
  getUnreadBooks,
  getShortStory,
} from "../controllers/book/getControllers"

import {
  createBook,
  bookImage,
  submitBookRating,
  createUnreadBook,
  submitBookComment,
  createShortStory,
  submitShortStoryRating,
} from "../controllers/book/postControllers"

import {
  editBook,
  editBookRating,
  editBookComment,
  editShortStoryRating,
} from "../controllers/book/putControllers"

import {
  deleteBook,
  deleteBookComment,
} from "../controllers/book/deleteControllers"

import checkAuth from "../middlewares/checkAuth"
import upload from "../service/upload"

const app = express.Router()

app.route("/").get(getAllBooks).post(checkAuth, createBook)
app.get("/limit/:bookLimit", getLimitBooks)
app.get("/scores", getTotalScore)
app.get("/:bookId", getOneBook)
app.get("/title/:bookTitle", getOneBookTitle)
app.get("/genre/:bookGenre", getBookGenre)
app.get("/unread/all", getUnreadBooks)
app.get("/:bookId/:shortStoryId", getShortStory)
app.post("/:bookId", checkAuth, upload.single("picture"), bookImage)
app.post("/rating/:bookId", checkAuth, submitBookRating)
app.post("/comment/:bookId", checkAuth, submitBookComment)
app.post("/unread/create", checkAuth, createUnreadBook)
app.post("/:bookId/create", checkAuth, createShortStory)
app.post("/:bookId/:shortStoryId", checkAuth, submitShortStoryRating)
app.put("/:bookId", checkAuth, editBook)
app.put("/rating/edit/:bookId", checkAuth, editBookRating)
app.put("/comment/edit/:bookId", checkAuth, editBookComment)
app.put("/:bookId/:shortStoryId", checkAuth, editShortStoryRating)
app.delete("/:bookId", checkAuth, deleteBook)
app.delete("/comment/delete/:bookId", checkAuth, deleteBookComment)

export default app
