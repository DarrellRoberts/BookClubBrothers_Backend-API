import Book from "../schema/Book.js"

// Calculate and update the average book rating
export const calculateAverageRating = async (bookId) => {
  try {
    const book = await Book.findOne({ _id: bookId })

    if (!book) {
      throw new Error("Book not found to calculate rating")
    }

    // Get book info from Book schema
    const bookRating = book.scoreRatings.rating
    if (bookRating.length === 0) {
      bookRating.totalScore = 0
    } else {
      const totalRatingSum = bookRating.reduce((sum, rating) => sum + rating, 0)
      const calRating = totalRatingSum / bookRating.length
      const averageRate = await Book.findByIdAndUpdate(
        { _id: bookId },
        {
          $set: {
            totalScore: calRating,
          },
        }
      )
    }
  } catch (error) {
    console.error("Error calculating average book rating: ", error)
  }
}

const calcShortStoriesRating = async (bookId) => {
  try {
    const book = await Book.findOne({ _id: bookId })

    if (!book) {
      throw new Error("Book not found to calculate rating")
    }

    // Get book info from Book schema
    const bookRating = book.scoreRatings.rating

    if (bookRating.length === 0) {
      bookRating.totalScore = 0
    } else {
      const totalRatingSum = bookRating.reduce((sum, rating) => sum + rating, 0)
      const calRating = totalRatingSum / bookRating.length
      const averageRate = await Book.findByIdAndUpdate(
        { _id: bookId },
        {
          $set: {
            totalScore: calRating,
          },
        }
      )
    }
  } catch (error) {
    console.error("Error calculating average book rating: ", error)
  }
}
