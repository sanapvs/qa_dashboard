const bcrypt = require("bcryptjs")
const db = require("./database")

const email = "ved@hapticware.com"
const password = "password123"

const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email)

if (!existing) {
  const hashed = bcrypt.hashSync(password, 10)
  db.prepare(`
    INSERT INTO users (email, password, is_verified)
    VALUES (?, ?, 1)
  `).run(email, hashed)
  console.log(`Created verified demo user: ${email}`)
} else {
  console.log("User already exists")
}