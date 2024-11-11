const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to save user data
function saveUserData(username, password) {
  fs.appendFileSync('users.txt', `${username}:${password}\n`, 'utf8');
}

// Helper function to check user data
function checkUserData(username, password) {
  const data = fs.readFileSync('users.txt', 'utf8');
  const lines = data.split('\n');
  return lines.some(line => line === `${username}:${password}`);
}

// Route for signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  saveUserData(username, password);
  res.json({ message: 'Signup successful!' });
});

// Route for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (checkUserData(username, password)) {
    res.json({ message: 'Login successful!' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
