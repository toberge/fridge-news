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
  let things = null;
  try {
    let sql = fs.readFileSync(file, 'utf8'); // source of bug; provide encoding...
    sql.replace('\n', ' ');
    connection = await pool.getConnection();
    things = await connection.query(sql);
    console.log(`Ran ${file} successfully`);
  } finally {
    if (connection) connection.release();
  }
  return things;
};

const setup = async () => {
  await runSQL('database/init.sql', pool);
  await runSQL('database/data.sql', pool);
};

module.exports = [ pool, runSQL, setup ];
