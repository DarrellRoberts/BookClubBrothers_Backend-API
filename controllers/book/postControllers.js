const Book = require("../../schema/Book");
const User = require("../../schema/User");
const {
  calculateAverageRating,
  commentBadge,
  firstBookBadge,
  updateUserLoneWolfBadge,
  updateUserMostBooksBadge,
  punctualBadge,
} = require("../../utils/index");

const createBook = async (req, res) => {
  try {
    const bookInfo = req.body;
    const book = await Book.create({
      title: bookInfo.title,
      author: bookInfo.author,
      pages: bookInfo.pages,
      yearPublished: bookInfo.yearPublished,
      genre: bookInfo.genre,
      read: bookInfo.read,
      dateOfMeeting: bookInfo.dateOfMeeting,
      actualDateOfMeeting: bookInfo.actualDateOfMeeting,
      imageURL: bookInfo.imageURL,
      reviewImageURL: bookInfo.reviewImageURL,
      totalScore: bookInfo.totalScore,
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error, "from controller");
  }
};

const bookImage = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    if (req.file && req.file.path) {
      const bookImage = await Book.findByIdAndUpdate(
        { _id: bookId },
        {
          $set: { reviewImageURL: req.file.path },
        },
        { new: true }
      );
      await bookImage.save();
      return res.status(200).json({ msg: "image successfully saved" });
    } else {
      console.log("REQ FILE:" + req.file);
      res.status(422).json({ msg: "invalid file" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const submitBookRating = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const bookId = req.params.bookId;
    const rateDetails = req.body;

    const findBook = await Book.findOne({ _id: bookId });
    const findUser = await User.findOne({ _id: userId });

    if (findBook && findUser) {
      const bookScoreUserArray = findBook.scoreRatings.raterId;

      const hasUserRated = bookScoreUserArray.some(
        (raterId) => raterId.toString() === userId
      );

      if (hasUserRated) {
        return res
          .status(200)
          .json({ msg: "Your rating is already submitted" });
      } else {
        findUser.userInfo.books.booksScored.push(bookId);
        findUser.userInfo.books.score.push(rateDetails.rating);

        findBook.scoreRatings.raterId.push(userId);
        findBook.scoreRatings.rating.push(rateDetails.rating);

        await findUser.save();
        await findBook.save();
        res.status(200).json({ msg: "Rating submitted successfully" });
      }
    } else {
      return res.status(404).json({ msg: "Book or user not found" });
    }
    firstBookBadge(userId);
    updateUserLoneWolfBadge(userId, bookId);
    punctualBadge(userId, bookId);
    updateUserMostBooksBadge(userId);
    calculateAverageRating(bookId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const submitBookComment = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const bookId = req.params.bookId;
    const commentDetails = req.body;

    const findBook = await Book.findOne({ _id: bookId });
    const findUser = await User.findOne({ _id: userId });
    console.log(commentDetails.comments);
    if (findBook && findUser) {
      const bookScoreUserArray = findBook.commentInfo.commentId;

      const hasUserRated = bookScoreUserArray.some(
        (raterId) => raterId.toString() === userId
      );

      if (hasUserRated) {
        return res
          .status(200)
          .json({ msg: "Your comment is already submitted" });
      } else {
        findUser.userInfo.books.booksCommented.push(bookId);
        findUser.userInfo.books.comments.push(commentDetails.comments);

        findBook.commentInfo.commentId.push(userId);
        findBook.commentInfo.comments.push(commentDetails.comments);

        await findUser.save();
        await findBook.save();
        commentBadge(userId);
        res.status(200).json({ msg: "Comment submitted successfully" });
      }
    } else {
      return res.status(404).json({ msg: "Book or user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const createUnreadBook = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookInfo = req.body;
    const book = await Book.create({
      title: bookInfo.title,
      author: bookInfo.author,
      pages: bookInfo.pages,
      yearPublished: bookInfo.yearPublished,
      genre: bookInfo.genre,
      read: false,
      dateOfMeeting: bookInfo.dateOfMeeting,
      actualDateOfMeeting: bookInfo.actualDateOfMeeting,
      imageURL: bookInfo.imageURL,
      reviewImageURL: bookInfo.reviewImageURL,
      totalScore: bookInfo.totalScore,
      suggestedBy: userId,
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error, "from controller");
  }
};

module.exports = {
  createBook,
  bookImage,
  submitBookRating,
  submitBookComment,
  createUnreadBook,
};
