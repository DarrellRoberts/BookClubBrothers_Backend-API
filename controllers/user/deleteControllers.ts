import User from "../../schema/User"
import { AuthRequest } from "../../types/auth"
import { Response } from "express"

// Delete user
export const deleteUser = async (req: AuthRequest, res: Response) => {
  const userId = req.params.userId
  try {
    if (userId.toString() !== process.env.ADMIN_ID) {
      res
        .status(401)
        .json({ msg: "You are not authorised to delete this account" })
    }
    const userDeleted = await User.deleteOne({ _id: userId })
    res.status(200).json({ msg: "Your account successfully deleted" })
  } catch (error) {
    res.status(500).json({ msg: "The user was not successfully deleted" })
  }
}
