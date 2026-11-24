//programmer name: amal jaraisy
const express = require('express');

const app = express();


// Data from the course page (paste the full lines from Notion – descriptions are cut off in the screenshot)
const products = [
  { id: 1, name: 'Sofa', price: 39.99, description: 'Comfortable sofa' },
  { id: 2, name: 'Chair', price: 19.99, description: 'Wooden chair' },
  { id: 3, name: 'Coffee Table', price: 29.99, description: 'Modern coffee table' },
  { id: 4, name: 'Lamp', price: 9.99, description: 'Stylish lamp' },
  { id: 5, name: 'Desk', price: 49.99, description: 'Office desk' },
  { id: 2, name: 'Chair2', price: 19.99, description: 'Wooden chair' },
  { id: 2, name: 'Chair3', price: 79.99, description: 'Wooden chair' },
];

// GET /api/products?name=chair&minPrice=10&maxPrice=50&limit=3
// Every query parameter is OPTIONAL – if it's not in the URL, we skip that filter.
app.get('/api/products', (req, res) => {
  // req.query = everything after the "?", e.g. { name: 'chair', minPrice: '10', maxPrice: '50', limit: '3' }
  // (all values arrive as text)
  const { name, minPrice, maxPrice, limit } = req.query;

  let result = products; // start with all products, then narrow down step by step

  // 1. name – keep products whose name CONTAINS the text, ignoring upper/lower case
  //    name=chair  ->  "Chair", "Chair2", "Chair3"
  if (name) {
    result = result.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  }

  // 2. minPrice – keep products that cost at least minPrice
  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }

  // 3. maxPrice – keep products that cost at most maxPrice
  if (maxPrice) {
    result = result.filter(p => p.price <= Number(maxPrice));
  }

  // 4. limit – return at most this many products (slice keeps the first N)
  if (limit) {
    result = result.slice(0, Number(limit));
  }

  res.status(200).json(result);
});

// Anything else -> 404 (always LAST)
app.use((req, res) => {
  res.status(404).send('<h1>resource not found</h1>');
});

app.listen(3000, () => console.log("Ready on port 3000"));