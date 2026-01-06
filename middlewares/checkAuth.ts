import User from "../schema/User"
import jwt, { JwtPayload } from "jsonwebtoken"
import { AuthRequest } from "../types/auth"
import { Response, NextFunction } from "express"

// Check token if it is authorized
const checkAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authorization.split(" ")[1]

  // Verify token
  try {
    const { _id } = jwt.verify(
      token,
      process.env.SECRET as string
    ) as JwtPayload

    const user = await User.findOne({ _id: _id }).select("_id")

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" })
    }

    req.user = {
      _id: user._id.toString(),
      username: user.username,
    }
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: "Unauthorized" })
  }
}

export default checkAuth
