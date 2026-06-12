require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("./database")

const app = express()
const PORT = 4000
const JWT_SECRET = process.env.JWT_SECRET || "hapticware_secret_key"

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())


function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "No token provided" })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}


// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" })
  }

  const match = bcrypt.compareSync(password, user.password)
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password" })
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "8h" }
  )
  
  res.json({ token, email: user.email })
  
})

// POST /api/auth/register
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" })
  }

  const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
  if (existing) {
    return res.status(409).json({ error: "Email already registered" })
  }

  const hashed = bcrypt.hashSync(password, 10)
  db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, hashed)

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "8h" })
  res.status(201).json({ token, email })
})

// GET /api/auth/me , verify token and return user info
app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ email: req.user.email })
})


app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))