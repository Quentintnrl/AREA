const express = require('express');
const router = require('./Router/Router.js');
const mysql = require('mysql2/promise');

const app = express();
const port = 8000;
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

app.use('/', router(connection));
app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

