const bcrypt = require("bcryptjs")
const db = require("./database")

const email = "ved@hapticware.com"
const password = "password123"

const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email)

if (!existing) {
  const hashed = bcrypt.hashSync(password, 10)
  db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, hashed)
  console.log(`Created user: ${email}`)
} else {
  console.log("User already exists")
}