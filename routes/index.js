const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { convertCurrency } = require('./converter');
const { createUser, loginUser, generateApiKey } = require('./users');
const router= express.Router();
router.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'currency_api',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  createUser(connection, username, password, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error creating user' });
    } else {
      res.json({ message: 'User created successfully' });
    }
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  loginUser(connection, username, password, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error logging in' });
    } else if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      const token = jwt.sign({ username: user.username }, 'secretkey');
      res.json({ token });
    }
  });
});

router.post('/generateApiKey', (req, res) => {
  const { username } = req.body;
  generateApiKey(connection, username, (err, apiKey) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error generating API key' });
    } else {
      res.json({ apiKey });
    }
  });
});

router.get('/convertCurrency', (req, res) => {
  const { currencyInput, currencyOutput, amount } = req.query;
  
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    convertCurrency(currencyInput, currencyOutput, amount, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error converting currency' });
      } else {
        res.json(result);
      }
    });
  });
});




module.exports = router;