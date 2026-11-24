//programmer name: amal jaraisy
const express = require('express');

// 1. Use data.js – take "products" out of what data.js exports
const { products } = require('./data');

const app = express();


// 2. GET /products/:productPrice
//    Returns (as JSON) all products whose price is GREATER than productPrice
//    Example: /products/20  ->  albany sofa (39.95), entertainment center (29.98)
app.get('/products/:productPrice', (req, res) => {
  // req.params.productPrice is the value from the URL – always text, e.g. "20"
  const minPrice = Number(req.params.productPrice);

  // /products/abc  ->  not a number  ->  400 Bad Request
  if (isNaN(minPrice)) {
    return res.status(400).json({ error: 'productPrice must be a number' });
  }

  if(minPrice<0){
     return res.status(400).json({ error: 'productPrice number must be greater than 0' });
  }

  const result = products.filter(product => product.price > minPrice);
  res.status(200).json(result);
});

// Anything else -> 404 (always LAST)
app.use((req, res) => {
  res.status(404).send('<h1>resource not found</h1>');
});

app.listen(3000, () => console.log("Ready on port 3000"));