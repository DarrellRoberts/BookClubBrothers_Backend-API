const Book = require("../../schema/Book");
const User = require("../../schema/User");
const { calculateAverageRating } = require("../../utils/index");

const editBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user._id.toString();

    const book = await Book.findById(bookId);
    const suggestedById = book.suggestedBy;

    if (suggestedById || userId === "65723ac894b239fe25fe6871") {
      if (suggestedById !== userId && userId !== "65723ac894b239fe25fe6871") {
        return res.status(401).json({
          error: `${userId} does not have the permission to edit this book`,
        });
      }
      const {
        title,
        author,
        pages,
        yearPublished,
        genre,
        read,
        dateOfMeeting,
        actualDateOfMeeting,
        imageURL,
        reviewImageURL,
        totalScore,
        scoreRatings,
        suggestedBy,
      } = req.body;
      const updateBook = await Book.findByIdAndUpdate(
        bookId,
        {
          title,
          author,
          pages,
          yearPublished,
          genre,
          read,
          dateOfMeeting,
          actualDateOfMeeting,
          imageURL,
          reviewImageURL,
          totalScore,
          scoreRatings,
          suggestedBy,
        },
        {
          new: true,
        }
      );
      if (!updateBook) {
        console.log(id);
        return res.status(404).json({ error: `${bookId} book not found` });
      }
      res.status(200).json(updateBook);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error });
  }
};

const editBookRating = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const bookId = req.params.bookId;
    const rateDetails = req.body;

    const findBook = await Book.findOne({ _id: bookId });
    const findUser = await User.findOne({ _id: userId });

    if (findBook && findUser) {
      const bookScoreUserArray = findBook.scoreRatings.raterId;
      const ratingBookIndex = bookScoreUserArray.indexOf(userId);

      const userScoreBookArray = findUser.userInfo.books.booksScored;
      const ratingUserIndex = userScoreBookArray.indexOf(bookId);

      findUser.userInfo.books.score.splice(
        ratingUserIndex,
        1,
        rateDetails.rating
      );
      findBook.scoreRatings.rating.splice(
        ratingBookIndex,
        1,
        rateDetails.rating
      );
      await findUser.save();
      await findBook.save();
      res.status(200).json({ msg: "Rating submitted edited" });
    } else {
      return res.status(404).json({ msg: "Book or user not found" });
    }
    calculateAverageRating(bookId);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const editBookComment = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const bookId = req.params.bookId;
    const commentDetails = req.body;

    const findBook = await Book.findOne({ _id: bookId });
    const findUser = await User.findOne({ _id: userId });

    if (findBook && findUser) {
      const bookScoreUserArray = findBook.commentInfo.commentId;
      const userScoreBookArray = findUser.userInfo.books.booksCommented;

      const commentBookIndex = bookScoreUserArray.indexOf(userId);
      const commentUserIndex = userScoreBookArray.indexOf(bookId);

      findBook.commentInfo.comments.splice(
        commentBookIndex,
        1,
        commentDetails.comments
      );
      findUser.userInfo.books.comments.splice(
        commentUserIndex,
        1,
        commentDetails.comments
      );

      await findUser.save();
      await findBook.save();
      res.status(200).json({ msg: "Rating submitted edited" });
    } else {
      return res.status(404).json({ msg: "Book or user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { editBook, editBookRating, editBookComment };
