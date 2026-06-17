const Database = require("better-sqlite3")
const path = require("path")

const db = new Database(path.join(__dirname, "qa_dashboard.db"))

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verification_code TEXT,
    code_expires_at DATETIME,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

module.exports = db