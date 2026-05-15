import 'dotenv/config'
import type { Request, Response } from 'express'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import supabase from './db/supabaseClient.js'

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

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})