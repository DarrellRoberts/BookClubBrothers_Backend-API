import User from "../../schema/User"
import { AuthRequest } from "../../types/auth"
import { Response } from "express"

// View one profile user
export const viewOneUserProfile = async (req: AuthRequest, res: Response) => {
  const username = req.params.username
  try {
    const user = await User.findOne({ username }).select("-password")
    if (user) {
      res.status(200).json(user)
    } else {
      return res.status(404).json({ msg: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

// View one profile user with id
export const viewOneUserProfileId = async (req: AuthRequest, res: Response) => {
  const userId = req.params.id
  try {
    const user = await User.findOne({ _id: userId }).select("-password")
    if (user) {
      res.status(200).json(user)
    } else {
      return res.status(404).json({ msg: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

// View all profile user
export const viewAllUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.find().select("-password")
    if (user.length === 0) {
      res.status(404).json({ msg: "No users exist" })
    } else {
      res.status(200).json(user)
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}
