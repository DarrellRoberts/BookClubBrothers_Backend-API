import { Request } from "express"

export interface AuthRequest<
  P = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: {
    _id: string
    username: string
    // You can add 'username' or 'email' here if your JWT contains them
  }
  file: any
}
