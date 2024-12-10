require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./Router/Router.js');
const pool = require('./db').close;

const app = express();
const port = 8080;

app.use(cors());
app.use('/', router());
app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

// pool();