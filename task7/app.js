const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Tell Express to use EJS templates from the "views" folder (for section d)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1. Read the list of users from users.json (once, when the server starts)
function getUsers() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
}

// a. GET /api/users  ->  all users
app.get('/api/users', (req, res) => {
     const users = getUsers();
  res.json(users);
});

// b. GET /api/users/filter?minAge=20&maxAge=30  ->  users in that age range
// IMPORTANT: this must come BEFORE /api/users/:id,
// otherwise Express thinks "filter" is an id (first match wins!)
app.get('/api/users/filter', (req, res) => {
     const users = getUsers();
  // req.query holds the part after the "?"  ->  { minAge: '20', maxAge: '30' }
  // Missing value = no limit on that side
  const minAge = req.query.minAge !== undefined ? Number(req.query.minAge) : 0;
  const maxAge = req.query.maxAge !== undefined ? Number(req.query.maxAge) : Infinity;

  if (isNaN(minAge) || isNaN(maxAge)) {
    return res.status(400).json({ error: 'minAge and maxAge must be numbers' });
  }

  const result = users.filter(u => u.age >= minAge && u.age <= maxAge);
  res.json(result);
});

// c. GET /api/users/:id  ->  one user, or 404
app.get('/api/users/:id', (req, res) => {
     const users = getUsers();
  // req.params holds the ":" parts of the path  ->  { id: '3' }  (always a string!)
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User ${req.params.id} not found` });
  }
  res.json(user);
});

// d. GET /user/:id  ->  an HTML page with the user's details (using a template)
app.get('/user/:id', (req, res) => {
     const users = getUsers();
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).send(`<h1>User ${req.params.id} not found</h1>`);
  }
  // Fills views/user.ejs with this user's data and sends the HTML
  res.render('user', { user });
});

// Anything else -> 404 (always LAST)
app.use( (req, res) => {
     const users = getUsers();
  res.status(404).send('<h1>resource not found</h1>');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});