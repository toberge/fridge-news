// @flow
const mysql = require('mysql2/promise');
const DAO = require('./DAO');

module.exports = class CommentDAO extends DAO {
  constructor(pool: mysql.PromisePool) {
    super(pool);
  }

};
