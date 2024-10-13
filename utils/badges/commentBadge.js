const User = require("../../schema/User");

const commentBadge = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
          }
        if(user.userInfo.books.booksCommented.length >= 5) {
            user.userInfo.badges.fiveComments = true;
        }
        await user.save()
    } catch(err) {
        console.error(err);
        console.log("Error occurred updating lone wolf badge");
    }
}

module.exports = { commentBadge };