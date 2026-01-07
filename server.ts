import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import bookRoutes from "./routes/book"
import userRoutes from "./routes/user"
import { connectDB } from "./dbinit"

dotenv.config()

const app = express()

const PORT = Number(process.env.PORT) || 8080

connectDB()

// Necessary middlewaree
app.use(cors())
app.use(express.json())

// Routes
app.use("/books", bookRoutes)
app.use("/users", userRoutes)

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the BookClub Brothers")
})
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
