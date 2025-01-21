const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/routes.js');


app.use(cors());
app.use(express.json());
router.get('/', (req, res) => {
    res.send('Hello World');
  });

module.exports = app;