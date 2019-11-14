// @flow

const fs = require('fs');
const mysql = require('mysql2/promise');

const conf = JSON.parse(fs.readFileSync('database/test-properties.json', 'utf8'));
const pool = mysql.createPool({
  ...conf,
  connectionLimit: 4,
  waitForConnections: true,
  debug: false
});

const runSQL = async (file: string, pool: mysql.PromisePool) => {
  let connection: mysql.PromiseConnection = null;
  try {
    // Using this person's solution https://stackoverflow.com/a/22659240
    // could've written my own, but I didn't wanna bother after all that debugging
    let sql = fs
      .readFileSync(file, 'utf8')
      .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
      .replace(/\s+/g, ' ') // remove whitespace
      .split(';') // split into statements
      .map(e => e.trim()) // remove more whitespace
      .filter(e => e.length !== 0); // finally, skip empty lines
    connection = await pool.getConnection();
    for (let s of sql) {
      await connection.query(s);
    }
  } finally {
    if (connection) connection.release();
  }
};

const setup = async () => {
  await runSQL('database/sql/init.sql', pool);
  await runSQL('database/sql/test.sql', pool);
};

module.exports = [pool, setup];
