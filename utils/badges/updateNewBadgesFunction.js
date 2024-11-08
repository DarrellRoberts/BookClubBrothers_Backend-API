// only use this function to add new badges

const User = require("../../schema/User");

async function updateNewBadgesFunction() {
  try {
    const users = await User.find();

    for (const user of users) {
      user.loggedIn = false;
      await user.save();
    }

    console.log("All user profiles updated with badges.");
  } catch (error) {
    console.error("Error updating user profiles:", error);
  }
}

// updateNewBadgesFunction();
