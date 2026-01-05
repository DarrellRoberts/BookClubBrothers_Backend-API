import Book from "../../schema/Book.ts"
import User from "../../schema/User.ts"
import { AuthRequest } from "../../types/auth.ts"
import { Response } from "express"
import { calculateAverageRating } from "../../utils/index.ts"

export const editBook = async (req: AuthRequest, res: Response) => {
  try {
    const bookId = req.params.bookId
    const userId = req.user._id.toString()

    const book = await Book.findById(bookId)
    const suggestedById = book?.suggestedBy?.toString()

    if (suggestedById || userId === "65723ac894b239fe25fe6871") {
      if (suggestedById !== userId && userId !== "65723ac894b239fe25fe6871") {
        return res.status(401).json({
          error: `${userId} does not have the permission to edit this book`,
        })
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
        shortStories,
      } = req.body
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
          shortStories,
        },
        {
          new: true,
        }
      )
      if (!updateBook) {
        return res.status(404).json({ error: `${bookId} book not found` })
      }
      res.status(200).json(updateBook)
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const editBookRating = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id.toString()
    const bookId = req.params.bookId
    const rateDetails = req.body

    const findBook = await Book.findOne({ _id: bookId })
    const findUser = await User.findOne({ _id: userId })

    if (findBook && findUser) {
      const bookScoreUserArray = findBook.scoreRatings?.raterId
      const ratingBookIndex = bookScoreUserArray?.indexOf(
        userId as any
      ) as number

      const userScoreBookArray = findUser.userInfo?.books?.booksScored
      const ratingUserIndex = userScoreBookArray?.indexOf(
        bookId as any
      ) as number

      findUser.userInfo?.books?.score.splice(
        ratingUserIndex,
        1,
        rateDetails.rating
      )
      findBook.scoreRatings?.rating.splice(
        ratingBookIndex,
        1,
        rateDetails.rating
      )
      await findUser.save()
      await findBook.save()
      res.status(200).json({ msg: "Rating submitted edited" })
    } else {
      return res.status(404).json({ msg: "Book or user not found" })
    }
    calculateAverageRating(bookId)
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const editShortStoryRating = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id.toString()
    const bookId = req.params.bookId
    const shortStoryId = req.params.shortStoryId
    const rateDetails = req.body

    const findBook = await Book.findOne({ _id: bookId })
    const findUser = await User.findOne({ _id: userId })

    const shortStory = findBook?.shortStories.find(
      (story) => story._id.toString() === shortStoryId
    )

    if (!shortStory) {
      return res.status(404).json({ msg: "Short story does not exist" })
    }

    if (findBook && findUser) {
      shortStory.scoreRatings?.rating.splice(
        shortStory.scoreRatings.raterId.indexOf(userId as any),
        1,
        rateDetails.rating
      )

      const ratedStories = findBook.shortStories.filter((story) =>
        story.scoreRatings?.raterId?.includes(userId as any)
      )
      const newTotalRating = ratedStories.reduce((acc, current) => {
        return (
          acc +
          (current?.scoreRatings?.rating
            ? current.scoreRatings.rating[
                current.scoreRatings.raterId!.indexOf(userId as any)
              ]
            : 0)
        )
      }, 0)
      const newRating = newTotalRating / ratedStories.length
      const bookScoreUserArray = findBook.scoreRatings?.raterId
      const ratingBookIndex = bookScoreUserArray?.indexOf(
        userId as any
      ) as number

      const userScoreBookArray = findUser.userInfo?.books?.booksScored
      const ratingUserIndex = userScoreBookArray?.indexOf(
        bookId as any
      ) as number

      findUser.userInfo?.books?.score.splice(ratingUserIndex, 1, newRating)
      findBook.scoreRatings?.rating.splice(ratingBookIndex, 1, newRating)

      await findUser.save()
      await findBook.save()
      calculateAverageRating(bookId)
      return res
        .status(200)
        .json({ msg: "Rating edited successfully", findBook })
    } else {
      return res.status(404).json({ msg: "Book or user not found" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const editBookComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id.toString()
    const bookId = req.params.bookId
    const commentDetails = req.body

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

      findBook.commentInfo?.comments.splice(
        commentBookIndex,
        1,
        commentDetails.comments
      )
      findUser.userInfo?.books?.comments.splice(
        commentUserIndex,
        1,
        commentDetails.comments
      )

      await findUser.save()
      await findBook.save()
      res.status(200).json({ msg: "Rating submitted edited" })
    } else {
      return res.status(404).json({ msg: "Book or user not found" })
    }
  } catch (error) {
    return res.status(500).json({ error })
  }
}
