import type { Request, Response } from 'express'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials:true
}

app.use(cors(corsOptions))
app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false
}))

app.get('/', (req:Request, res:Response) => {
  res.status(200).send('Test Route')
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})