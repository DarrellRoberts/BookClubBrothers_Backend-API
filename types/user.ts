import { Model, Schema } from "mongoose"

export interface UserModel extends Model<User> {
  signup(userInfo: any): Promise<any>
  login(username: string, password: string): Promise<any>
  resetPassword(
    username: string,
    password: string,
    confirm: string
  ): Promise<any>
}

export interface User {
  userInfo: {
    books: {
      booksCommented: Schema.Types.ObjectId[]
      booksScored: Schema.Types.ObjectId[]
      comments: string[]
      score: number[]
    }
    favGenre: string[]
    profileURL: string
    residence: {
      country: string
      city: string
    }
    badges: {
      allBooks: boolean
      loneWolf: number
      mostBooks: boolean
      fiveComments: boolean
      firstBook: boolean
      punctual: number
    }
  }
  username: string
  _id: Schema.Types.ObjectId
  lastLoggedIn: string
}
