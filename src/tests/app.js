const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/endpoint', (req, res) => {
  const { headers, query, body } = req;
  res.json({ headers, query, body });
});

module.exports = app;
