import User from "../../schema/User"

export const commentBadge = async (userId: string) => {
  try {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      throw new Error("User not found")
    }
    if (user.userInfo!.books!.booksCommented.length >= 5) {
      user.userInfo!.badges!.fiveComments = true
    }
    await user.save()
  } catch (err) {
    console.log("Error occurred updating comment badge", err)
  }
}
