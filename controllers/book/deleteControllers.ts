import { Response } from "express"
import { AuthRequest } from "../../types/index"
import Book from "../../schema/Book"
import User from "../../schema/User"

export const deleteBook = async (req: AuthRequest, res: Response) => {
  try {
    const bookId = req.params.bookId
    const userId = req.user?._id.toString()

    const book = await Book.findById(bookId)
    const suggestedById = book?.suggestedBy?.toString()

    if (suggestedById || userId === process.env.ADMIN_ID) {
      if (suggestedById !== userId && userId !== process.env.ADMIN_ID) {
        return res.status(403).json({
          error: `${userId} does not have the permission to delete this book`,
        })
      }
      if (!book) {
        return res.status(404).json({ msg: "Book not found" })
      }
      const bookDeleted = await Book.deleteOne({ _id: bookId })
      res.status(200).json({ msg: "Book deleted successfully" })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const deleteBookComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id.toString() as string
    const bookId = req.params.bookId

    const findBook = await Book.findOne({ _id: bookId })
    const findUser = await User.findOne({ _id: userId })

    if (findBook && findUser) {
      const bookScoreUserArray = findBook.commentInfo?.commentId
      const userScoreBookArray = findUser.userInfo?.books?.booksCommented

      const commentBookIndex = bookScoreUserArray?.indexOf(
        userId as any
      ) as number
      const commentUserIndex = userScoreBookArray?.indexOf(
        bookId as any
      ) as number

      findBook.commentInfo?.comments?.splice(commentBookIndex, 1)
      findUser.userInfo?.books?.comments.splice(commentUserIndex, 1)

      await findUser.save()
      await findBook.save()
      res.status(200).json({ msg: "Rating submitted deleted" })
    } else {
      return res.status(404).json({ msg: "Book or user not found" })
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}
