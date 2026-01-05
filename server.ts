import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import bookRoutes from "./routes/book.js"
import userRoutes from "./routes/user.js"
import { connectDB } from "./dbinit.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT

connectDB()

// Necessary middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/books", bookRoutes)
app.use("/users", userRoutes)

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the BookClub Brothers")
})
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
