const User = require("../../schema/User");

// View one profile user
const viewOneUserProfile = async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View all profile user
const viewAllUserProfile = async (req, res) => {
  try {
    const user = await User.find().select("-password");
    if (user.length === 0) {
      res.status(404).json({ msg: "No users exist" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { viewOneUserProfile, viewAllUserProfile };
