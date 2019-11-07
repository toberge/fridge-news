// @flow
const mysql = require('mysql2/promise');

module.exports = class DAO {
  pool: mysql.PromisePool;

  constructor(pool: mysql.PromisePool) {
    this.pool = pool;
    this.execute.bind(this);
    this.getConnection.bind(this);
  }

  getConnection() {
    return this.pool.getConnection();
  };

  async query(sql: string)  {
    let connection = null, result = null;
    try {
      connection = await this.getConnection();
      result = await connection.query(sql);
    } finally {
      if (connection) connection.release();
      // console.log(this.pool.pool._allConnections._list.length);
      // console.log(this.pool.pool._freeConnections._list.length);
    }
    return Promise.all([result]);
  };


  async execute(sql: string, ...params: (string | number)[]) {
    let connection = null, result = null;
    try {
      connection = await this.getConnection();
      result = await connection.execute(sql, params);
    } finally {
      if (connection) connection.release();
      // console.log(this.pool.pool._allConnections._list.length);
      // console.log(this.pool.pool._freeConnections._list.length);
    }
    return Promise.all([result]);
  };
};
