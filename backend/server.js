require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("./database")
const { sendVerificationCode } = require("./mailer")

const app = express()
const PORT = 4000
const JWT_SECRET = process.env.JWT_SECRET || "hapticware_secret_key"

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "No token provided" })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
}

// ── Register (sends a verification code instead of logging straight in) ──
app.post("/api/auth/register", async (req, res) => {
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
  const code = generateCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

  db.prepare(`
    INSERT INTO users (email, password, verification_code, code_expires_at, is_verified)
    VALUES (?, ?, ?, ?, 0)
  `).run(email, hashed, code, expiresAt)

  try {
    await sendVerificationCode(email, code)
  } catch (err) {
    console.error("Failed to send email:", err)
    return res.status(500).json({ error: "Failed to send verification email" })
  }

  res.status(201).json({ message: "Verification code sent to your email", email })
})

// ── Verify code ──────────────────────────────────────────────────
app.post("/api/auth/verify", (req, res) => {
  const { email, code } = req.body

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
  if (!user) return res.status(404).json({ error: "User not found" })

  if (user.is_verified) {
    return res.status(400).json({ error: "Account already verified" })
  }

  if (user.verification_code !== code) {
    return res.status(400).json({ error: "Incorrect verification code" })
  }

  if (new Date(user.code_expires_at) < new Date()) {
    return res.status(400).json({ error: "Verification code has expired" })
  }

  db.prepare("UPDATE users SET is_verified = 1, verification_code = NULL WHERE email = ?").run(email)

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "8h" })
  res.json({ token, email: user.email })
})

// ── Resend code ──────────────────────────────────────────────────
app.post("/api/auth/resend-code", async (req, res) => {
  const { email } = req.body

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
  if (!user) return res.status(404).json({ error: "User not found" })
  if (user.is_verified) return res.status(400).json({ error: "Account already verified" })

  const code = generateCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  db.prepare("UPDATE users SET verification_code = ?, code_expires_at = ? WHERE email = ?")
    .run(code, expiresAt, email)

  try {
    await sendVerificationCode(email, code)
  } catch (err) {
    return res.status(500).json({ error: "Failed to send verification email" })
  }

  res.json({ message: "New code sent" })
})

// ── Login (only works if verified) ──────────────────────────────
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
  if (!user) return res.status(401).json({ error: "Invalid email or password" })

  const match = bcrypt.compareSync(password, user.password)
  if (!match) return res.status(401).json({ error: "Invalid email or password" })

  if (!user.is_verified) {
    return res.status(403).json({ error: "Account not verified. Please check your email.", needsVerification: true })
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "8h" })
  res.json({ token, email: user.email })
})

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ email: req.user.email })
})

app.get("/", (req, res) => {
  res.json({ status: "QA Dashboard API running", version: "1.0" })
})

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))