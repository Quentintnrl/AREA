require('dotenv').config();
const mysql = require('mysql2');
const retry = require('promise-retry');

const connectionConfig = {
  host: process.env.MYSQL_HOST,  // 'db' service name
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const connection = mysql.createConnection(connectionConfig);

function connectWithRetry() {
  return retry((retryAttempt) => {
    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.log(`Connection attempt failed. Retrying in ${retryAttempt}ms...`);
          return reject(err);  // Retry the connection
        }
        resolve(connection);
      });
    });
  }, { retries: 5, minTimeout: 2000 });
}

connectWithRetry()
  .then(() => {
    console.log('Connected to MySQL');
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL after multiple attempts', err);
  });

module.exports = {
  connection: connection.promise(),
  close: () => connection.end(),
};
