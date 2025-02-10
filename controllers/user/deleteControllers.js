const User = require("../../schema/User");

// Delete user
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userDeleted = await User.deleteOne({ _id: userId });
    res.status(200).json({ msg: "Your account successfully deleted" });
  } catch (error) {
    res.status(500).json({ msg: "The user was not successfully deleted" });
  }
};

module.exports = { deleteUser };
