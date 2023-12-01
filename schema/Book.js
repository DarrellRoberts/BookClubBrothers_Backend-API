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
    score: {
        type: Number,
        min: 0,
        max: 10
    },
    // scoreRatings: {
    //         type: Number,
    //         ref: "User"
    //     },
    // suggestedBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User"
    // }
}
);

module.exports = mongoose.model("Book", bookSchema);


