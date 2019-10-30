// @flow
const mysql = require('mysql2/promise');
const DAO = require('./DAO');

module.exports = class ArticleDAO extends DAO {
  constructor(pool: mysql.PromisePool) {
    super(pool);
  }

  async getAll() {
    const [[rows]] = await super.query('SELECT * FROM articles');
    return rows;
  }

  getOne = async (id: number) => {
    const [[rows]] = await super.execute('SELECT * FROM articles_view WHERE article_id = ?', id);
    return rows[0];
  };

  /* [number, string, string | null, string | null, string | null, string, 1 | 2, string]*/
  // TODO just send in an object & make a type for it
  addOne = async (article: Array<number | string>) => {
    const [[fields]] = await super.execute(
      'INSERT INTO articles(user_id, title, picture_path, picture_alt, picture_caption, content, importance, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ...article
    );
    return fields.insertId;
  };
};
