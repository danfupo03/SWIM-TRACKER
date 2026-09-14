import { Database } from "bun:sqlite";

const db = new Database("swim-tracker.db");

db.run(`
  CREATE TABLE IF NOT EXISTS times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test TEXT NOT NULL,
    time_seconds REAL NOT NULL,
    place TEXT NOT NULL,
    date TEXT NOT NULL,
    season TEXT NOT NULL
  )
`);

export default db;