//programmer name: amal jaraisy

const express = require('express');
const users = require('./users.json');

const app = express();


// a. all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// b. filter by age (must be BEFORE /api/users/:id)
app.get('/api/users/filter', (req, res) => {
  const minAge = req.query.minAge !== undefined ? Number(req.query.minAge) : 0;
  const maxAge = req.query.maxAge !== undefined ? Number(req.query.maxAge) : Infinity;

  const result = users.filter(u => u.age >= minAge && u.age <= maxAge);
  res.json(result);
});

// c. one user by id
app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User ${req.params.id} not found` });
  }
  res.json(user);
});

// d. HTML page with the user's details
app.get('/user/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).send(`<h1>User ${req.params.id} not found</h1>`);
  }

  res.send(`
    <html>
      <body>
        <h1>${user.name}</h1>
        <p>ID: ${user.id}</p>
        <p>Email: ${user.email}</p>
        <p>Age: ${user.age}</p>
      </body>
    </html>
  `);
});

// anything else -> 404 (always LAST)
app.use((req, res) => {
  res.status(404).send('<h1>resource not found</h1>');
});

app.listen(3000, () => console.log("Ready on port 3000"));