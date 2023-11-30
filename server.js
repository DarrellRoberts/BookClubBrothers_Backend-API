const express = require("express")
const cors = require("cors")
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

// const connectDB = require("./dbinit");
// connectDB();

// Necessary middleware
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to the BookClub Brothers")
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})