const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory array to store users (temporarily for Vercel demo)
const users = [];

// Registration Endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    // If username exists, we can mock error or just let them "re-register"
    // To make demo seamless, we just return error
    return res.status(409).json({ error: 'Username already exists' });
  }

  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully', userId: newUser.id, username });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Success
  return res.status(200).json({ message: 'Login successful', username: user.username });
});

// Simple GET endpoint to verify backend is running on Vercel
app.get('/', (req, res) => {
  res.send('Backend Server is running successfully on Vercel!');
});

app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});

// Export the Express app so Vercel can run it as a serverless function
module.exports = app;
