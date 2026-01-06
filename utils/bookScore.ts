import Book from "../schema/Book"

// Calculate and update the average book rating
export const calculateAverageRating = async (bookId: string) => {
  try {
    const book = await Book.findOne({ _id: bookId })

    if (!book) {
      throw new Error("Book not found to calculate rating")
    }

    // Get book info from Book schema
    const bookRating = book.scoreRatings?.rating
    if (bookRating?.length === 0) {
      book.totalScore = 0
    } else {
      const totalRatingSum = bookRating!.reduce(
        (sum, rating) => sum + rating,
        0
      )
      const calRating = totalRatingSum / bookRating!.length
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

export const calcShortStoriesRating = async (bookId: string) => {
  try {
    const book = await Book.findOne({ _id: bookId })

    if (!book) {
      throw new Error("Book not found to calculate rating")
    }

    // Get book info from Book schema
    const bookRating = book.scoreRatings?.rating

    if (bookRating?.length === 0) {
      book.totalScore = 0
    } else {
      const totalRatingSum = bookRating?.reduce(
        (sum, rating) => sum + rating,
        0
      ) as number
      const calRating = totalRatingSum / bookRating!.length
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
