// const Book = require("../schema/Book");
// const User = require("../schema/User");
// const {
// calculateAverageRating,
// commentBadge,
// firstBookBadge,
// updateUserLoneWolfBadge,
// updateUserMostBooksBadge,
// punctualBadge,
// } = require("../utils/index.js");

// Create book
// const createBook = async (req, res) => {
//   try {
//     const bookInfo = req.body;
//     const book = await Book.create({
//       title: bookInfo.title,
//       author: bookInfo.author,
//       pages: bookInfo.pages,
//       yearPublished: bookInfo.yearPublished,
//       genre: bookInfo.genre,
//       read: bookInfo.read,
//       dateOfMeeting: bookInfo.dateOfMeeting,
//       actualDateOfMeeting: bookInfo.actualDateOfMeeting,
//       imageURL: bookInfo.imageURL,
//       reviewImageURL: bookInfo.reviewImageURL,
//       totalScore: bookInfo.totalScore,
//     });
//     res.status(200).json(book);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log(error, "from controller");
//   }
// };

// Upload book image
// const bookImage = async (req, res) => {
//   try {
//     const bookId = req.params.bookId;
//     if (req.file && req.file.path) {
//       const bookImage = await Book.findByIdAndUpdate(
//         { _id: bookId },
//         {
//           $set: { reviewImageURL: req.file.path },
//         },
//         { new: true }
//       );
//       await bookImage.save();
//       return res.status(200).json({ msg: "image successfully saved" });
//     } else {
//       console.log("REQ FILE:" + req.file);
//       res.status(422).json({ msg: "invalid file" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// Get all books
// const getAllBooks = async (req, res) => {
//   try {
//     const books = await Book.find().sort({ dateOfMeeting: -1 });
//     if (books.length === 0) {
//       return res.status(200).json({ msg: "No books exist" });
//     }
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get limit books
// const getLimitBooks = async (req, res) => {
//   try {
//     const bookLimit = parseInt(req.params.bookLimit);
//     if (isNaN(bookLimit) || bookLimit < 0) {
//       return res.status(400).json({
//         error: "Invalid bookLimit parameter. Must be a non-negative integer.",
//       });
//     }
//     const books = await Book.find()
//       .sort({ dateOfMeeting: -1 })
//       .limit(bookLimit);
//     if (books.length === 0) {
//       return res.status(200).json({ msg: "No books exist" });
//     }
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get one book
// const getOneBook = async (req, res) => {
//   try {
//     const bookId = req.params.bookId;
//     const books = await Book.findOne({ _id: bookId });
//     // .populate("suggestedBy", ["name"]);
//     if (!books) {
//       return res.status(404).json({ msg: "Book not found" });
//     }
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get one book by title
// const getOneBookTitle = async (req, res) => {
//   try {
//     const bookTitle = req.params.bookTitle;
//     const books = await Book.findOne({ title: bookTitle });
//     // .populate("suggestedBy", ["name"]);
//     if (!books) {
//       return res.status(404).json({ msg: "Book not found" });
//     }
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get book by genre
// const getBookGenre = async (req, res) => {
//   try {
//     const bookGenre = req.params.bookGenre;
//     const books = await Book.find({ genre: [[bookGenre]] });
//     // .populate("suggestedBy", ["name"]);
//     if (!books) {
//       return res.status(404).json({ msg: "Book not found" });
//     }
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get book by unread
// const getUnreadBooks = async (req, res) => {
//   try {
//     const books = await Book.find({ read: false });
//     console.log("Found books:", books);
//     if (!books) {
//       return res.status(404).json({ msg: "Book not found" });
//     }
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Edit book
// const editBook = async (req, res) => {
//   try {
//     const bookId = req.params.bookId;
//     const userId = req.user._id.toString();

//     const book = await Book.findById(bookId);
//     const suggestedById = book.suggestedBy;

//     if (suggestedById || userId === "65723ac894b239fe25fe6871") {
//       if (suggestedById !== userId && userId !== "65723ac894b239fe25fe6871") {
//         return res.status(401).json({
//           error: `${userId} does not have the permission to edit this book`,
//         });
//       }
//       const {
//         title,
//         author,
//         pages,
//         yearPublished,
//         genre,
//         read,
//         dateOfMeeting,
//         actualDateOfMeeting,
//         imageURL,
//         reviewImageURL,
//         totalScore,
//         scoreRatings,
//         suggestedBy,
//       } = req.body;
//       const updateBook = await Book.findByIdAndUpdate(
//         bookId,
//         {
//           title,
//           author,
//           pages,
//           yearPublished,
//           genre,
//           read,
//           dateOfMeeting,
//           actualDateOfMeeting,
//           imageURL,
//           reviewImageURL,
//           totalScore,
//           scoreRatings,
//           suggestedBy,
//         },
//         {
//           new: true,
//         }
//       );
//       if (!updateBook) {
//         console.log(id);
//         return res.status(404).json({ error: `${bookId} book not found` });
//       }
//       res.status(200).json(updateBook);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: error });
//   }
// };

// Delete Book
// const deleteBook = async (req, res) => {
//   try {
//     const bookId = req.params.bookId;
//     const userId = req.user._id.toString();

//     const book = await Book.findById(bookId);
//     const suggestedById = book.suggestedBy;

//     if (suggestedById || userId === "65723ac894b239fe25fe6871") {
//       if (suggestedById !== userId && userId !== "65723ac894b239fe25fe6871") {
//         return res.status(401).json({
//           error: `${userId} does not have the permission to delete this book`,
//         });
//       }
//       if (!book) {
//         return res.status(404).json({ msg: "Book not found" });
//       }
//       const bookDeleted = await Book.deleteOne({ _id: bookId });
//       res.status(200).json({ msg: "Book deleted successfully" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const submitBookRating = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const bookId = req.params.bookId;
//     const rateDetails = req.body;

//     const findBook = await Book.findOne({ _id: bookId });
//     const findUser = await User.findOne({ _id: userId });

//     if (findBook && findUser) {
//       const bookScoreUserArray = findBook.scoreRatings.raterId;

//       const hasUserRated = bookScoreUserArray.some(
//         (raterId) => raterId.toString() === userId
//       );

//       if (hasUserRated) {
//         return res
//           .status(200)
//           .json({ msg: "Your rating is already submitted" });
//       } else {
//         findUser.userInfo.books.booksScored.push(bookId);
//         findUser.userInfo.books.score.push(rateDetails.rating);

//         findBook.scoreRatings.raterId.push(userId);
//         findBook.scoreRatings.rating.push(rateDetails.rating);

//         await findUser.save();
//         await findBook.save();
//         res.status(200).json({ msg: "Rating submitted successfully" });
//       }
//     } else {
//       return res.status(404).json({ msg: "Book or user not found" });
//     }
//     firstBookBadge(userId);
//     updateUserLoneWolfBadge(userId, bookId);
//     punctualBadge(userId, bookId);
//     updateUserMostBooksBadge(userId);
//     calculateAverageRating(bookId);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// const editBookRating = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const bookId = req.params.bookId;
//     const rateDetails = req.body;

//     const findBook = await Book.findOne({ _id: bookId });
//     const findUser = await User.findOne({ _id: userId });

//     if (findBook && findUser) {
//       const bookScoreUserArray = findBook.scoreRatings.raterId;
//       const ratingBookIndex = bookScoreUserArray.indexOf(userId);

//       const userScoreBookArray = findUser.userInfo.books.booksScored;
//       const ratingUserIndex = userScoreBookArray.indexOf(bookId);

//       findUser.userInfo.books.score.splice(
//         ratingUserIndex,
//         1,
//         rateDetails.rating
//       );
//       findBook.scoreRatings.rating.splice(
//         ratingBookIndex,
//         1,
//         rateDetails.rating
//       );
//       await findUser.save();
//       await findBook.save();
//       res.status(200).json({ msg: "Rating submitted edited" });
//     } else {
//       return res.status(404).json({ msg: "Book or user not found" });
//     }
//     calculateAverageRating(bookId);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// const submitBookComment = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const bookId = req.params.bookId;
//     const commentDetails = req.body;

//     const findBook = await Book.findOne({ _id: bookId });
//     const findUser = await User.findOne({ _id: userId });
//     console.log(commentDetails.comments);
//     if (findBook && findUser) {
//       const bookScoreUserArray = findBook.commentInfo.commentId;

//       const hasUserRated = bookScoreUserArray.some(
//         (raterId) => raterId.toString() === userId
//       );

//       if (hasUserRated) {
//         return res
//           .status(200)
//           .json({ msg: "Your comment is already submitted" });
//       } else {
//         findUser.userInfo.books.booksCommented.push(bookId);
//         findUser.userInfo.books.comments.push(commentDetails.comments);

//         findBook.commentInfo.commentId.push(userId);
//         findBook.commentInfo.comments.push(commentDetails.comments);

//         await findUser.save();
//         await findBook.save();
//         commentBadge(userId);
//         res.status(200).json({ msg: "Comment submitted successfully" });
//       }
//     } else {
//       return res.status(404).json({ msg: "Book or user not found" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// const editBookComment = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const bookId = req.params.bookId;
//     const commentDetails = req.body;

//     const findBook = await Book.findOne({ _id: bookId });
//     const findUser = await User.findOne({ _id: userId });

//     if (findBook && findUser) {
//       const bookScoreUserArray = findBook.commentInfo.commentId;
//       const userScoreBookArray = findUser.userInfo.books.booksCommented;

//       const commentBookIndex = bookScoreUserArray.indexOf(userId);
//       const commentUserIndex = userScoreBookArray.indexOf(bookId);

//       findBook.commentInfo.comments.splice(
//         commentBookIndex,
//         1,
//         commentDetails.comments
//       );
//       findUser.userInfo.books.comments.splice(
//         commentUserIndex,
//         1,
//         commentDetails.comments
//       );

//       await findUser.save();
//       await findBook.save();
//       res.status(200).json({ msg: "Rating submitted edited" });
//     } else {
//       return res.status(404).json({ msg: "Book or user not found" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

//delete comment, needs testing
// const deleteBookComment = async (req, res) => {
//   try {
//     const userId = req.user._id.toString();
//     const bookId = req.params.bookId;

//     const findBook = await Book.findOne({ _id: bookId });
//     const findUser = await User.findOne({ _id: userId });

//     if (findBook && findUser) {
//       const bookScoreUserArray = findBook.commentInfo.commentId;
//       const userScoreBookArray = findUser.userInfo.books.booksCommented;

//       const commentBookIndex = bookScoreUserArray.indexOf(userId);
//       const commentUserIndex = userScoreBookArray.indexOf(bookId);

//       findBook.commentInfo.comments.splice(commentBookIndex, 1);
//       findUser.userInfo.books.comments.splice(commentUserIndex, 1);

//       await findUser.save();
//       await findBook.save();
//       res.status(200).json({ msg: "Rating submitted deleted" });
//     } else {
//       return res.status(404).json({ msg: "Book or user not found" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// add a new book, read: false
// const createUnreadBook = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const bookInfo = req.body;
//     const book = await Book.create({
//       title: bookInfo.title,
//       author: bookInfo.author,
//       pages: bookInfo.pages,
//       yearPublished: bookInfo.yearPublished,
//       genre: bookInfo.genre,
//       read: false,
//       dateOfMeeting: bookInfo.dateOfMeeting,
//       actualDateOfMeeting: bookInfo.actualDateOfMeeting,
//       imageURL: bookInfo.imageURL,
//       reviewImageURL: bookInfo.reviewImageURL,
//       totalScore: bookInfo.totalScore,
//       suggestedBy: userId,
//     });
//     res.status(200).json(book);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log(error, "from controller");
//   }
// };

// const getTotalScore = async (req, res) => {
//   try {
//     const books = await Book.find({}, { totalScore: 1, title: 1, _id: 0 }).sort(
//       { totalScore: -1 }
//     );
//     if (!books) {
//       return res.status(404).json({ msg: "Book not found" });
//     }
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
// createBook,
// getAllBooks,
// getLimitBooks,
// getOneBook,
// getOneBookTitle,
// getBookGenre,
// bookImage,
// editBook,
// deleteBook,
// submitBookRating,
// editBookRating,
// submitBookComment,
// editBookComment,
// deleteBookComment,
// createUnreadBook,
// getTotalScore,
// getUnreadBooks,
// };
