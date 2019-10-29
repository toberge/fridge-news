// @flow

const fs = require('fs');
const mysql = require('mysql2/promise');

const conf = JSON.parse(fs.readFileSync('database/test.json', 'utf8'));
const pool = mysql.createPool({
  ...conf,
  connectionLimit: 4,
  waitForConnections: true,
  debug: false
});

const runSQL = async (file: string, pool: mysql.PromisePool) => {
  let connection: mysql.PromiseConnection = null;
  try {
    const sql = fs.readFileSync(file);
    connection = await pool.getConnection();
    connection.query(sql);
    console.log(`Ran ${file} successfully`);
  } catch (e) {
    console.trace(e);
  } finally {
    if (connection) connection.release();
  }
};

const setup = async () => {
  await runSQL('./init.sql', pool);
  await runSQL('./data.sql', pool);
};

module.exports = [ pool, runSQL, setup ];
