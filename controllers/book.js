const Book = require("../schema/Book");
const User = require("../schema/User");
const { calculateAverageRating } = require("../utils/bookScore");


// Create book
const createBook = async (req, res) => {
    try {
        const bookInfo = req.body;
        const book = await Book.create({
                title: bookInfo.title,
                author: bookInfo.author,
                pages: bookInfo.pages,
                yearPublished: bookInfo.yearPublished,
                genre: bookInfo.genre,
                read: bookInfo.read,
                dateOfMeeting: bookInfo.dateOfMeeting,
                imageURL: bookInfo.imageURL,
                reviewImageURL: bookInfo.reviewImageURL,
                totalScore: bookInfo.totalScore,
                });
                res.status(200).json(book);
            } catch (error) {
                res.status(500).json({ error: error.message });
                console.log(error, "from controller");
            }
        }

// Upload book image
const bookImage = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        if (req.file && req.file.path) {
            const bookImage = await Book.findByIdAndUpdate(
                {_id: bookId },
                {
                    $set: {"reviewImageURL": req.file.path }
                },
                { new: true}
            );
            await bookImage.save()
            return res.status(200).json({msg: "image successfully saved" });
        } else {
            console.log("REQ FILE:" + req.file);
            res.status(422).json({msg: "invalid file"});
        }
    } catch(error) {
        console.error(error);
        res.status(500).json( {error: error.message });
    }
};

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find()
        // .populate("suggestedBy", [
        //     "name"
        // ]);
        if (books.length === 0) {
            return res.status(200).json({msg: "No books exist"});
        } 
        res.status(200).json(books)
    } catch(error) {
        res.status(500).json({error: error.message})
    }
};

// Get one book 
const getOneBook = async (req, res) => {
    try {
    const bookId = req.params.bookId;
    const books = await Book.findOne({ _id: bookId })
    // .populate("suggestedBy", ["name"]);
    if (!books) {
        return res.status(404).json({ msg: "Book not found"});
    }
    res.status(200).json(books);
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

// Get one book by title
const getOneBookTitle = async (req, res) => {
    try {
    const bookTitle = req.params.bookTitle;
    const books = await Book.findOne({ "title": bookTitle })
    // .populate("suggestedBy", ["name"]);
    if (!books) {
        return res.status(404).json({ msg: "Book not found"});
    }
    res.status(200).json(books);
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

// Get book by genre
const getBookGenre = async (req, res) => {
    try {
    const bookGenre = req.params.bookGenre;
    const books = await Book.find({ genre: [[bookGenre]] });
    // .populate("suggestedBy", ["name"]);
    if (!books) {
        return res.status(404).json({ msg: "Book not found"});
    }
    res.status(200).json(books);
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

// Edit book
const editBook = async (req,res) => {
    try {
    const bookId = req.params.bookId;
    const { 
        title, 
        author, 
        pages, 
        yearPublished, 
        genre, 
        read, 
        dateOfMeeting, 
        imageURL, 
        reviewImageURL, 
        totalScore, 
        scoreRatings, 
        suggestedBy
    } = req.body
    const updateBook = await Book.findByIdAndUpdate(
        bookId, {
            title, 
            author, 
            pages, 
            yearPublished, 
            genre, 
            read, 
            dateOfMeeting, 
            imageURL, 
            reviewImageURL, 
            totalScore, 
            scoreRatings, 
            suggestedBy
        },
        { 
            new: true 
        },
    );
    if (!updateBook) {
        console.log(id);
        return res.status(404).json({ error: `${bookId} book not found`});
    }
    console.log(req.body);
    res.status(200).json(updateBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: error})
    }
}

// edit book rating

// Delete Book
const deleteBook = async (req, res) => {
    try {
    const bookId = req.params.bookId;
    const book = await Book.find({ _id: bookId });
    if (!book) {
        return res.status(404).json({ msg: "Book not found" });
    }
    const bookDeleted = await Book.deleteOne({ _id: bookId });
    res.status(200).json({ msg: "Book deleted successfully"});
    } catch(error) {
        res.status(500).json({ error: error.message})
    }
}

const submitBookRating = async (req, res) => {
        try {
            const userId = req.user._id.toString();
            const bookId = req.params.bookId;
            const rateDetails = req.body;
    
            const findBook = await Book.findOne({ _id: bookId });
            const findUser = await User.findOne({ _id: userId });
    
            if (findBook && findUser) {
                const bookScoreUserArray = findBook.scoreRatings.raterId;
    
                const hasUserRated = bookScoreUserArray.some(raterId => raterId.toString() === userId);
    
                if (hasUserRated) {
                    return res.status(200).json({ msg: "Your rating is already submitted" });
                } else {
                    findUser.userInfo.books.booksScored.push(bookId);
                    findUser.userInfo.books.score.push(rateDetails.rating);
    
                    findBook.scoreRatings.raterId.push(userId);
                    findBook.scoreRatings.rating.push(rateDetails.rating);
    
                    await findUser.save();
                    await findBook.save();
                    res.status(200).json({ msg: "Rating submitted successfully" });
                }
            } else {
                return res.status(404).json({ msg: "Book or user not found" });
            }
            calculateAverageRating(bookId);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    };

    const editBookRating = async (req, res) => {
        try {
            const userId = req.user._id.toString();
            const bookId = req.params.bookId;
            const rateDetails = req.body;

            const findBook = await Book.findOne({ _id: bookId });
            const findUser = await User.findOne({ _id: userId }); 

            if (findBook && findUser) {
                const bookScoreUserArray = findBook.scoreRatings.raterId;
                const ratingIndex = bookScoreUserArray.indexOf(userId)
                findUser.userInfo.books.score.splice(ratingIndex, 1, rateDetails.rating);
                findBook.scoreRatings.rating.splice(ratingIndex,1,rateDetails.rating);
                await findUser.save();
                await findBook.save();
                res.status(200).json({ msg: "Rating submitted edited" });
            } else {
                return res.status(404).json({ msg: "Book or user not found" });
            }
            calculateAverageRating(bookId);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    };

const submitBookComment = async (req,res) => {
    try {
        const userId = req.user._id.toString();
        const bookId = req.params.bookId;
        const commentDetails = req.body;

        const findBook = await Book.findOne({ _id: bookId });
        const findUser = await User.findOne({ _id: userId });
        console.log(commentDetails.comments);
        if (findBook && findUser) {
            const bookScoreUserArray = findBook.commentInfo.commentId;

            const hasUserRated = bookScoreUserArray.some(raterId => raterId.toString() === userId);

            if (hasUserRated) {
                return res.status(200).json({ msg: "Your comment is already submitted" });
            } else {
                findUser.userInfo.books.booksCommented.push(bookId);
                findUser.userInfo.books.comments.push(commentDetails.comments);

                findBook.commentInfo.commentId.push(userId);
                findBook.commentInfo.comments.push(commentDetails.comments);

                await findUser.save();
                await findBook.save();
                res.status(200).json({ msg: "Comment submitted successfully" });
            }
        } else {
            return res.status(404).json({ msg: "Book or user not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

const editBookComment = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const bookId = req.params.bookId;
        const commentDetails = req.body;

        const findBook = await Book.findOne({ _id: bookId });
        const findUser = await User.findOne({ _id: userId }); 

        if (findBook && findUser) {
            const bookScoreUserArray = findBook.commentInfo.commentId;
            const commentIndex = bookScoreUserArray.indexOf(userId)
            findUser.userInfo.books.comments.splice(commentIndex, 1, commentDetails.comments);
            findBook.commentInfo.comments.splice(commentIndex,1,commentDetails.comments);
            await findUser.save();
            await findBook.save();
            res.status(200).json({ msg: "Rating submitted edited" });
        } else {
            return res.status(404).json({ msg: "Book or user not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

// add a new book, read: false
const createUnreadBook = async (req, res) => {
    try {
        const userId = req.user._id
        const bookInfo = req.body;
        const book = await Book.create({
                title: bookInfo.title,
                author: bookInfo.author,
                pages: bookInfo.pages,
                yearPublished: bookInfo.yearPublished,
                genre: bookInfo.genre,
                read: false,
                dateOfMeeting: bookInfo.dateOfMeeting,
                imageURL: bookInfo.imageURL,
                reviewImageURL: bookInfo.reviewImageURL,
                totalScore: bookInfo.totalScore,
                suggestedBy: userId,
                });
                res.status(200).json(book);
            } catch (error) {
                res.status(500).json({ error: error.message });
                console.log(error, "from controller");
            }
    }

const getTotalScore = async (req,res) => {
    try {
        const books = await Book.find({}, { totalScore: 1, title: 1, _id: 0 }).sort({ totalScore: -1});
        if (!books) {
            return res.status(404).json({ msg: "Book not found"});
        }
        res.status(200).json(books);
        } catch(error) {
            res.status(500).json({error: error.message})
        }
}

module.exports = {
createBook,
getAllBooks,
getOneBook,
getOneBookTitle,
getBookGenre,
bookImage,
editBook,
deleteBook,
submitBookRating,
editBookRating,
submitBookComment,
editBookComment,
createUnreadBook,
getTotalScore
}