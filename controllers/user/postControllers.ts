import User from "../../schema/User"
import jwt from "jsonwebtoken"
import { Response } from "express"
import { AuthRequest } from "../../types/auth"
import { Schema } from "mongoose"

const createToken = (
  _id: Schema.Types.ObjectId,
  username: string,
  profileURL: string | null
) => {
  return jwt.sign({ _id, username, profileURL }, process.env.SECRET as string, {
    expiresIn: "1d",
  })
}

export const userSignUp = async (req: AuthRequest, res: Response) => {
  const userInfo = req.body
  const userImage = req.file

  try {
    const userCount = await User.countDocuments()
    if (userCount >= 5) {
      return res.status(400).json({ error: "The club is full!" })
    }
    const newUser = await User.signup(userInfo)
    if (userImage && newUser) {
      newUser.userInfo.profileURL = userImage.path
      await newUser.save()
    }
    const token = createToken(
      newUser._id,
      newUser.username,
      newUser.userInfo?.profileURL || null
    )

    res.status(200).json({ username: newUser.username, token })
  } catch (error) {
    res.status(400).json({ error })
  }
}

// Reset password
export const resetPasswordUser = async (req: AuthRequest, res: Response) => {
  const { username, password: NewPass, confirm_password } = req.body
  try {
    const user = await User.resetPassword(username, NewPass, confirm_password)
    if (!user) {
      res.status(400).json({ msg: "Error resetting password" })
    } else {
      res.status(200).json(user)
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

//login user
export const loginUser = async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body

  try {
    const user = await User.login(username, password)

    const profileURL = user.userInfo?.profileURL || null

    // 3. Create the token
    const token = createToken(user._id, user.username, profileURL)

    user.lastLoggedIn = new Date()
    await user.save()

    res.status(200).json({ username, token })
    console.log("success with login")
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

//upload Image
export const uploadUserImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId
    if (req.file && req.file.path) {
      const userImage = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: { "userInfo.profileURL": req.file.path },
        },
        { new: true }
      )
      await userImage?.save()
      return res.status(200).json({ msg: "image successfully saved" })
    } else {
      res.status(422).json({ msg: "invalid file" })
    }
  } catch (err) {
    return res.status(500).json({ err })
  }
}
