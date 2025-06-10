const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
  },
  yearPublished: {
    type: Number,
  },
  genre: [
    {
      type: [String],
      enum: [
        "Horror",
        "Thriller",
        "Comedy",
        "Romance",
        "Fantasy",
        "Adventure",
        "Anti-war",
        "Drama",
        "Action",
        "Science-fiction",
        "Dystopian",
        "Postmodern",
        "Anthology",
        "Non-fiction",
      ],
    },
  ],
  read: {
    type: Boolean,
  },
  dateOfMeeting: {
    // format "1999-05-23"
    type: Date,
  },
  actualDateOfMeeting: {
    // format "1999-05-23"
    type: Date,
  },
  shortStories:[
    {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    title: {
      type: String
    },
    author: {
      type: String
    },
    pages: {
      type: Number
    },
    scoreRatings: {
      raterId: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
      rating: {
        type: [Number],
        default: [],
        min: 0,
        max: 10,
      },
    },
    commentInfo: {
      commentId: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
      },
      comments: {
        type: [String],
        default: [],
        maxLength: 500,
      },
    },
  },
],
  imageURL: {
    type: String,
  },
  reviewImageURL: {
    type: String,
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 10,
  },
  scoreRatings: {
    raterId: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    rating: {
      type: [Number],
      default: [],
      min: 0,
      max: 10,
    },
  },
  commentInfo: {
    commentId: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: {
      type: [String],
      default: [],
      maxLength: 500,
    },
  },
  suggestedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Book", bookSchema);
