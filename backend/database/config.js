const pgPromise = require('pg-promise');
require('dotenv').config();

const pgp = pgPromise({
  // Optional connection monitoring
  query: (e) => {
    console.log('QUERY:', e.query);
  }
});

const cn = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
};

const db = pgp(cn);

module.exports = db;