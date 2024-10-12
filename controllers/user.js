const User = require("../schema/User.js");
const jwt = require("jsonwebtoken");

const createToken = (_id, username, profileURL) => {
    return jwt.sign({ _id, username, profileURL }, process.env.SECRET, {
      expiresIn: "1d",
    });
  };

  const userSignUp = async (req, res) => {
    const userInfo = req.body;
    const userImage = req.file;
    const user = await User.find()
    if (user.length <= 5) {
    try {
      let user = await User.signup(userInfo);
      if (userImage && user && req.file.path) {
        user = await User.findOneAndUpdate(
          { username: userInfo.username },
          {
            $set: { "profileURL": req.file.path },
          }
        );
      }
      await user.save();
  
      const updatedUser = await User.findOne({ username: userInfo.username });
      //creating token
      let token;
      if (updatedUser.profileURL) {
        token = createToken(
          updatedUser._id,
          updatedUser.username,
          updatedUser.userInfo.userImage
        );
      } else {
        token = createToken(user._id, user.username);
      }
      res.status(200).json({ username: userInfo.username, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(401).json({msg: "This bookclub is exclusive and has reached its limit in terms of membership. Contact the admin if you would like to join. He might be persuaded :) "})
  }
  };

// Reset password
const resetPasswordUser = async (req, res) => {
    const { username, password: NewPass, confirm_password } = req.body;
    try {
      const user = await User.resetPassword(username, NewPass, confirm_password);
      if (!user) {
        res.status(400).json({ msg: "Error resetting password" });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

//login user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
      const userImg = await User.findOne({ username });
  
      const user = await User.login(username, password);
  
//creating token
      let token;
      if (userImg.profileURL) {
        token = createToken(user._id, user.username, userImg.profileURL);
      } else {
        token = createToken(user._id, user.username);
      }
  
      res.status(200).json({ username, token });
      console.log("success with login");
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

// View one profile user
const viewOneUserProfile = async (req, res) => {
    const username = req.params.username;
    try {
      const user = await User.findOne({ username }).select('-password');
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
      const user = await User.find().select('-password');
      if (user.length === 0) {
        res.status(404).json({msg: "No users exist"})
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

//upload Image
  const uploadUserImage = async (req, res) => {
    try {
    const userId = req.params.userId;
      if (req.file && req.file.path) {
        const userImage = await User.findByIdAndUpdate(
          {_id: userId },
          {
            $set: {"userInfo.profileURL": req.file.path}
          },
          { new: true}
        );
        await userImage.save()
        return res.status(200).json({ msg: "image successfully saved" });
      } else {
        res.status(422).json({ msg: "invalid file" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ err });
    }
  };

// Edit user
const editUsername = async (req,res) => {
  try {
  const userId = req.params.userId;
  const { 
      username
  } = req.body
  const updateUser = await User.findByIdAndUpdate(
      userId, {
          username,
      },
      { 
          new: true 
      },
  );
  if (!updateUser) {
      console.log(id);
      return res.status(404).json({ error: `${userId} user not found`});
  }
  console.log(req.body);
  res.status(200).json(updateUser);
  } catch (error) {
      console.error(error);
      res.status(500).json({msg: error})
  }
}

// Edit userInfo
const editUserInfo = async (req,res) => {
  try {
  const userId = req.params.userId;
  const updatedInfo = req.body
  const updateUser = await User.findByIdAndUpdate(
      {
          _id: userId
      },
      {
        $set: {
        "userInfo.residence.city": updatedInfo.userInfo.residence?.city,
        "userInfo.residence.country": updatedInfo.userInfo.residence?.country,
        },
        $push: {
        "userInfo.favGenre": updatedInfo.userInfo.favGenre
        },
      },
      { 
          new: true 
      },
  );
  if (!updateUser) {
      console.log(id);
      return res.status(404).json({ error: `${userId} user not found`});
  }
  console.log(req.body);
  await updateUser.save();
  res.status(200).json(updateUser);
  } catch (error) {
      console.error(error);
      res.status(500).json({msg: error})
  }
}

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

module.exports = {
userSignUp,
resetPasswordUser,
loginUser,
viewOneUserProfile,
viewAllUserProfile,
uploadUserImage,
deleteUser,
editUsername,
editUserInfo
}