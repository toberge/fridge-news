// @flow
const mysql = require('mysql2/promise');
const DAO = require('./DAO');

type Comment = {
  article_id: number,
  user_id: number,
  content: string
};

module.exports = class CommentDAO extends DAO {
  constructor(pool: mysql.PromisePool) {
    super(pool);
  }

  getOne = async (id: number) => {
    const [[rows]] = await super.execute('SELECT * FROM comments WHERE comment_id = ?', id);
    return rows[0];
  };

  getByArticle = async (id: number) => {
    const [[rows]] = await super.execute('SELECT * FROM comments WHERE article_id = ? ORDER BY upload_time DESC', id);
    return rows;
  };

  addOne = async ({ article_id, user_id, content }: Comment) => {
    const [[fields]] = await super.execute(
      'INSERT INTO comments(article_id, user_id, content) VALUES(?, ?, ?)',
      article_id,
      user_id,
      content
    );
    return fields;
  };
};
