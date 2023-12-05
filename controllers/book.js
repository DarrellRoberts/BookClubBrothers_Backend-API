const Book = require("../schema/Book");


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
    const books = await Book.find({ genre: { $elemMatch: { $in:[[bookGenre]] } } });
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

module.exports = {
createBook,
getAllBooks,
getOneBook,
getOneBookTitle,
getBookGenre,
bookImage,
editBook,
deleteBook
}