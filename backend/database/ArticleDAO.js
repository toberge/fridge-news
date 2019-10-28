// @flow
const mysql = require('mysql2/promise');
const DAO = require('./DAO');

module.exports = class ArticleDAO extends DAO {
  constructor(pool: mysql.PromisePool) {
    super(pool);
  }

  async getAll () {
    const [[rows]] = await super.query('SELECT * FROM articles');
    return rows;
  }

  getOne = async (id: number) => {
    const [[rows]] = await super.execute('SELECT * FROM articles_view WHERE article_id = ?', id);
    return rows[0];
  }
};
