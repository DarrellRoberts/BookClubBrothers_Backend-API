import User from "../../schema/User"

export const updateUserMostBooksBadge = async (userId) => {
  try {
    const users = await User.find()
    const user = await User.findOne({ _id: userId })
    if (!user) {
      throw new Error("User not found")
    }
    const readLengthArray = users.map(
      (user) => user.userInfo.books.booksScored.length
    )
    const longestLength = Math.max(...readLengthArray)
    const userLongestLength = users?.filter(
      (user) => user.userInfo.books.booksScored.length === longestLength
    )
    const idArrays = userLongestLength?.map((user) => user._id.toString())
    if (idArrays.includes(userId)) {
      user.userInfo.badges.allBooks = true
    } else {
      console.log("User not highest")
    }
    await user.save()
  } catch (err) {
    console.error(err)
    console.log("Error occurred updating most books badge")
  }
}
