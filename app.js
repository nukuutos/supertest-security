const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.put('/user/:userId', (req, res) => {
  res.json({ name: 'john' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  const { message, statusCode } = error;

  console.error(message, '\n', error);

  return res.status(statusCode || 500).json({
    message: message || 'Server error occured. Please try again.',
  });
});

module.exports = app;
