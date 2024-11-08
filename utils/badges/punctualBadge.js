const User = require("../../schema/User");
const Book = require("../../schema/Book");

const punctualBadge = async (userId, bookId) => {
  try {
    const user = await User.findOne({ _id: userId });
    const book = await Book.findOne({ _id: bookId });
    if (!user) {
      throw new Error("User not found");
    }
    if (!book) {
      throw new Error("Book not found");
    }
    const meetingDateInMs = new Date(book.dateOfMeeting).getTime();
    const currentDateInMs = Date.now();
    if (meetingDateInMs > currentDateInMs) {
      user.userInfo.badges.punctual++;
    }
    await user.save();
  } catch (err) {
    console.error(err);
    console.log("Error occurred updating punctual badge");
  }
};

module.exports = { punctualBadge };
