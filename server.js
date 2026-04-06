const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const insertSQL = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(insertSQL, [username, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Failed to create account' });
      }
      
      // Success
      return res.status(201).json({ message: 'User registered successfully', userId: this.lastID, username });
    });
  } catch (error) {
    console.error('Registration server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const selectSQL = `SELECT * FROM users WHERE username = ?`;
  db.get(selectSQL, [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Success
    return res.status(200).json({ message: 'Login successful', username: user.username });
  });
});

app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});
