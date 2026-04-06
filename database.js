const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    // Enable Foreign Keys if needed
    db.run('PRAGMA foreign_keys = ON');
    
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `, (createErr) => {
      if (createErr) {
        console.error('Error creating users table', createErr.message);
      } else {
        console.log('Users table ready.');
      }
    });

    // We can add Tasks table here later
  }
});

module.exports = db;
