import User from "../../schema/User"

export const firstBookBadge = async (userId: string) => {
  try {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      throw new Error("User not found")
    }
    if (user.userInfo!.books!.booksScored.length >= 1) {
      user.userInfo!.badges!.firstBook = true
    }
    await user.save()
  } catch (err) {
    console.error(err)
    console.log("Error occurred updating first book badge")
  }
}
