// only use this function to add new badges

import User from "../../schema/User.ts"
import Book from "../../schema/Book.ts"

async function updateNewBadgesFunction() {
  try {
    const users = await User.find()

    for (const user of users) {
      user.userInfo.badges = {
        loneWolf: 0,
      }
      await user.save()
    }

    console.log("All user profiles updated with badges.")
  } catch (error) {
    console.error("Error updating user profiles:", error)
  }
}

// updateNewBadgesFunction();
