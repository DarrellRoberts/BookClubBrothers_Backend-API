import { Schema } from "mongoose"

export interface Book {
  author: string
  commentInfo?: {
    commentId?: Schema.Types.ObjectId[]
    comments?: string[] | string
  }
  dateOfMeeting?: string
  actualDateOfMeeting?: string
  reviewImageURL?: string
  genre: any
  imageURL?: string
  pages: number
  read?: boolean
  scoreRatings?: {
    raterId?: Schema.Types.ObjectId[]
    rating?: number[] | number
  }
  suggestedBy?: string
  shortStories?: ShortBook[]
  title: string
  totalScore?: number
  yearPublished: number
  _id?: Schema.Types.ObjectId
}

export interface ShortBook {
  scoreRatings: {
    raterId?: Schema.Types.ObjectId[]
    rating?: number[]
  }
  commentInfo?: {
    commentId?: Schema.Types.ObjectId[]
    comments?: string[] | string
  }

  parentId: Schema.Types.ObjectId
  title: string
  author: string
  pages: number
  _id: Schema.Types.ObjectId
}
