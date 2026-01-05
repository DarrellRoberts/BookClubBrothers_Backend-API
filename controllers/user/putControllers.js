import User from "../../schema/User"

// Edit user
export const editUsername = async (req, res) => {
  try {
    const userId = req.params.userId
    const { username } = req.body
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
      },
      {
        new: true,
      }
    )
    if (!updateUser) {
      console.log(id)
      return res.status(404).json({ error: `${userId} user not found` })
    }
    console.log(req.body)
    res.status(200).json(updateUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: error })
  }
}

// Edit userInfo
export const editUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId
    const updatedInfo = req.body
    const updateUser = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          "userInfo.residence.city": updatedInfo.userInfo.residence?.city,
          "userInfo.residence.country": updatedInfo.userInfo.residence?.country,
        },
        $push: {
          "userInfo.favGenre": updatedInfo.userInfo.favGenre,
        },
      },
      {
        new: true,
      }
    )
    if (!updateUser) {
      console.log(id)
      return res.status(404).json({ error: `${userId} user not found` })
    }
    console.log(req.body)
    await updateUser.save()
    res.status(200).json(updateUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: error })
  }
}
