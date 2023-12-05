const express = require("express")
require("dotenv").config();
const app = express();
const cors = require("cors")
const colors = require("colors");
const bookRoutes = require("./routes/book.js")

const PORT = process.env.PORT;
const connectDB = require("./dbinit.js");
connectDB();

// Necessary middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/books", bookRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the BookClub Brothers")
})
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`.rainbow)
})