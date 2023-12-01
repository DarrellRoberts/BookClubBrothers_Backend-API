const Book = require("../schema/Book");

// Create book
const createBook = async (req, res) => {
    try {
        // const userId = req.user._id.toString();
        const bookInfo = req.body;
        console.log("REQ:  " + req)

        const book = await Book.create({
            title: bookInfo.title,
            author: bookInfo.author,
            pages: bookInfo.pages,
            yearPublished: bookInfo.yearPublished,
            genre: bookInfo.genre,
            read: bookInfo.read,
            score: bookInfo.score,
            // scoreRatings: bookInfo.scoreRatings,
            // suggestedBy: userId,
        });

        //bonding user with newly created event
        // const populatedEvent = await Event.findById(book._id).populate({
        //     path: "suggestedBy",
        //     select: "name",
        // })
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json( {error: error.message })
        console.log(error, "from controller");
    }
}

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

// Edit book
// const editBook = async (req,res) => {
//     try {
//     const updateBookInfo = req.body;
//     const bookId = req.params;
//     const updateBook = await Event.findByIdUpdate(
//         {}bookId,
//         { $set: updateBookInfo},
//         { new: true }
//     );
//     if (!updateBook) {
//         return res.status(404).json({ error: "book not found"});
//     }
//     await updateBook.save();
//     res.status(200).json(updateBook);
//     } catch (error) {
//         res.status(500).json({msg: "failed to update book"})
//     }
// }


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
// editBook,
deleteBook
}