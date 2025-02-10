const Book = require("../../schema/Book");

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ dateOfMeeting: -1 });
    if (books.length === 0) {
      return res.status(200).json({ msg: "No books exist" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLimitBooks = async (req, res) => {
  try {
    const bookLimit = parseInt(req.params.bookLimit);
    if (isNaN(bookLimit) || bookLimit < 0) {
      return res.status(400).json({
        error: "Invalid bookLimit parameter. Must be a non-negative integer.",
      });
    }
    const books = await Book.find()
      .sort({ dateOfMeeting: -1 })
      .limit(bookLimit);
    if (books.length === 0) {
      return res.status(200).json({ msg: "No books exist" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOneBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const books = await Book.findOne({ _id: bookId });
    // .populate("suggestedBy", ["name"]);
    if (!books) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOneBookTitle = async (req, res) => {
  try {
    const bookTitle = req.params.bookTitle;
    const books = await Book.findOne({ title: bookTitle });
    // .populate("suggestedBy", ["name"]);
    if (!books) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookGenre = async (req, res) => {
  try {
    const bookGenre = req.params.bookGenre;
    const books = await Book.find({ genre: [[bookGenre]] });
    // .populate("suggestedBy", ["name"]);
    if (!books) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnreadBooks = async (req, res) => {
  try {
    const books = await Book.find({ read: false });
    console.log("Found books:", books);
    if (!books) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalScore = async (req, res) => {
  try {
    const books = await Book.find({}, { totalScore: 1, title: 1, _id: 0 }).sort(
      { totalScore: -1 }
    );
    if (!books) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getLimitBooks,
  getOneBook,
  getOneBookTitle,
  getBookGenre,
  getUnreadBooks,
  getTotalScore
};
