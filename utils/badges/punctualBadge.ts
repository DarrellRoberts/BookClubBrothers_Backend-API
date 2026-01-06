import User from "../../schema/User"
import Book from "../../schema/Book"

export const punctualBadge = async (userId: string, bookId: string) => {
  try {
    const user = await User.findOne({ _id: userId })
    const book = await Book.findOne({ _id: bookId })
    if (!user) {
      throw new Error("User not found")
    }
    if (!book) {
      throw new Error("Book not found")
    }
    const meetingDateInMs = new Date(book.dateOfMeeting as Date).getTime()
    const currentDateInMs = Date.now()
    if (meetingDateInMs > currentDateInMs) {
      user.userInfo!.badges!.punctual++
    }
    await user.save()
  } catch (err) {
    console.log("Error occurred updating punctual badge", err)
  }
}
