import User from "../../schema/User"
import Book from "../../schema/Book"

export const updateUserLoneWolfBadge = async (userId, bookId) => {
  try {
    const user = await User.findOne({ _id: userId })
    const book = await Book.findOne({ _id: bookId })
    if (!user) {
      throw new Error("User not found")
    }
    if (!book) {
      throw new Error("Book not found")
    }
    if (book.scoreRatings.raterId.length === 1) {
      user.userInfo.badges.loneWolf++
    }
    await user.save()
  } catch (err) {
    console.error(err)
    console.log("Error occurred updating lone wolf badge")
  }
}
