const mongoose = require("mongoose");

const { Schema } = mongoose;

const bookSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    pages: {
        type: Number
    },
    yearPublished: {
        type: Number
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
                "Non-fiction"
            ],
        },
    ],
    read: {
        type: Boolean,
    },
    imageURL: {
        type: String,
    },
    totalScore: {
        type: Number,
        min: 0,
        max: 10
    },
    scoreRatings: [
        {
            raterId: {
                type: Schema.Types.ObjectId,
                ref: "User"
                    },
            rating: Number,
        },
    ],
    suggestedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}
);

module.exports = mongoose.model("Book", bookSchema);


