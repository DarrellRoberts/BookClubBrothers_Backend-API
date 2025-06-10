const Book = require("../../schema/Book")
const User = require("../../schema/User")
const {
  calculateAverageRating,
  commentBadge,
  firstBookBadge,
  updateUserLoneWolfBadge,
  updateUserMostBooksBadge,
  punctualBadge,
} = require("../../utils/index")

const createBook = async (req, res) => {
  try {
    const bookInfo = req.body
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
      shortStories: bookInfo.shortStories,
    })
    res.status(200).json(book)
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log(error, "from controller")
  }
}

const bookImage = async (req, res) => {
  try {
    const bookId = req.params.bookId
    if (req.file && req.file.path) {
      const bookImage = await Book.findByIdAndUpdate(
        { _id: bookId },
        {
          $set: { reviewImageURL: req.file.path },
        },
        { new: true }
      )
      await bookImage.save()
      return res.status(200).json({ msg: "image successfully saved" })
    } else {
      console.log("REQ FILE:" + req.file)
      res.status(422).json({ msg: "invalid file" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}

const submitBookRating = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const bookId = req.params.bookId
    const rateDetails = req.body

    const findBook = await Book.findOne({ _id: bookId })
    const findUser = await User.findOne({ _id: userId })

    if (findBook && findUser) {
      const bookScoreUserArray = findBook.scoreRatings.raterId

      const hasUserRated = bookScoreUserArray.some(
        (raterId) => raterId.toString() === userId
      )

      if (hasUserRated) {
        return res.status(200).json({ msg: "Your rating is already submitted" })
      } else {
        findUser.userInfo.books.booksScored.push(bookId)
        findUser.userInfo.books.score.push(rateDetails.rating)

        findBook.scoreRatings.raterId.push(userId)
        findBook.scoreRatings.rating.push(rateDetails.rating)

        await findUser.save()
        await findBook.save()
        res.status(200).json({ msg: "Rating submitted successfully" })
      }
    } else {
      return res.status(404).json({ msg: "Book or user not found" })
    }
    firstBookBadge(userId)
    updateUserLoneWolfBadge(userId, bookId)
    punctualBadge(userId, bookId)
    updateUserMostBooksBadge(userId)
    calculateAverageRating(bookId)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

const submitBookComment = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const bookId = req.params.bookId
    const commentDetails = req.body

    const findBook = await Book.findOne({ _id: bookId })
    const findUser = await User.findOne({ _id: userId })
    if (findBook && findUser) {
      const bookScoreUserArray = findBook.commentInfo.commentId

      const hasUserRated = bookScoreUserArray.some(
        (raterId) => raterId.toString() === userId
      )

      if (hasUserRated) {
        return res
          .status(200)
          .json({ msg: "Your comment is already submitted" })
      } else {
        findUser.userInfo.books.booksCommented.push(bookId)
        findUser.userInfo.books.comments.push(commentDetails.comments)

        findBook.commentInfo.commentId.push(userId)
        findBook.commentInfo.comments.push(commentDetails.comments)

        await findUser.save()
        await findBook.save()
        commentBadge(userId)
        res.status(200).json({ msg: "Comment submitted successfully" })
      }
    } else {
      return res.status(404).json({ msg: "Book or user not found" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

const createUnreadBook = async (req, res) => {
  try {
    const userId = req.user._id
    const bookInfo = req.body
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
    })
    res.status(200).json(book)
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log(error, "from controller")
  }
}

const createShortStory = async (req, res) => {
  try {
    const bookId = req.params.bookId

    const findBook = await Book.findOne({ _id: bookId })

    if (!findBook) {
      return res.status(404).json({ msg: "Book not found" })
    } else if (!findBook.genre.includes("Anthology")) {
      return res.status(405).json({ msg: "Book is not an Anthology" })
    } else {
      const shortStory = req.body
      shortStory.parentId = bookId.toString()
      findBook.shortStories.push(shortStory)
      await findBook.save()
      res.status(200).json(shortStory)
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const submitShortStoryRating = async (req, res) => {
  try {
    const userId = req.user._id.toString()
    const bookId = req.params.bookId
    const shortStoryId = req.params.shortStoryId
    const rateDetails = req.body

    const findBook = await Book.findOne({ _id: bookId })
    const findUser = await User.findOne({ _id: userId })

    if (!findBook) {
      return res.status(404).json({ msg: "Book not found" })
    } else if (!findBook.genre.includes("Anthology")) {
      return res.status(405).json({ msg: "Book has no short stories" })
    } else {
      const shortStory = findBook.shortStories.find(
        (story) => story._id.toString() === shortStoryId
      )
      if (!shortStory) {
        return res.status(404).json({ msg: "Short story does not exist" })
      }
      const bookScoreUserArray = findBook.scoreRatings.raterId

      const hasUserRated = bookScoreUserArray.some(
        (raterId) => raterId.toString() === userId
      )

      if (hasUserRated) {
        const hasUserRatedShortStory = shortStory.scoreRatings.raterId.some(
          (raterId) => raterId.toString() === userId
        )
        if (hasUserRatedShortStory) {
          return res.status(200).json({ msg: "User has already rated" })
        }
        shortStory.scoreRatings.raterId.push(userId)
        shortStory.scoreRatings.rating.push(rateDetails.rating)
        const ratedStories = findBook.shortStories.filter((story) =>
          story.scoreRatings.raterId.includes(userId)
        )
        const newTotalRating = ratedStories.reduce((acc, current) => {
          return (
            acc +
            current.scoreRatings.rating[
              current.scoreRatings.raterId.indexOf(userId)
            ]
          )
        }, 0)
        const newRating = newTotalRating / ratedStories.length
        const bookScoreUserArray = findBook.scoreRatings.raterId
        const ratingBookIndex = bookScoreUserArray.indexOf(userId)

        const userScoreBookArray = findUser.userInfo.books.booksScored
        const ratingUserIndex = userScoreBookArray.indexOf(bookId)

        findUser.userInfo.books.score.splice(ratingUserIndex, 1, newRating)
        findBook.scoreRatings.rating.splice(ratingBookIndex, 1, newRating)

        await findUser.save()
        await findBook.save()
        calculateAverageRating(bookId)
        return res.status(200).json({ msg: "Rating submitted successfully" })
      } else {
        shortStory.scoreRatings.raterId.push(userId)
        shortStory.scoreRatings.rating.push(rateDetails.rating)
        findUser.userInfo.books.booksScored.push(bookId)
        findUser.userInfo.books.score.push(rateDetails.rating)
        findBook.scoreRatings.raterId.push(userId)
        findBook.scoreRatings.rating.push(rateDetails.rating)

        await findUser.save()
        await findBook.save()
        calculateAverageRating(bookId)
        return res
          .status(200)
          .json({ msg: "Rating submitted successfully", findBook })
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  createBook,
  bookImage,
  submitBookRating,
  submitBookComment,
  createUnreadBook,
  createShortStory,
  submitShortStoryRating,
}
