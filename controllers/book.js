const Book = require("../schema/Book");

// Create book
const createBook = async (req, res) => {
    try {
        const bookInfo = req.body;
        const book = await Book.create({
            
        })
    } catch (error) {
        res.status(500).json( {error: error.message })
    }
}