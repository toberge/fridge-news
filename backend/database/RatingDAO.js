// @flow
const mysql = require('mysql2/promise');
const DAO = require('./DAO');

type Rating = { article_id: number, user_id: number, value: number };

module.exports = class RatingDAO extends DAO {
  constructor(pool: mysql.PromisePool) {
    super(pool);
  }

  getOne = async (article_id: number, user_id: number): Promise<Rating> => {
    const [[rows]] = await super.execute(
      'SELECT * FROM ratings WHERE article_id = ? AND user_id = ?',
      article_id,
      user_id
    );
    return rows[0];
  };

  addOne = async ({ article_id, user_id, value }: Rating) => {
    const [[fields]] = await super.execute(
      'INSERT INTO ratings(article_id, user_id, value) VALUES (?, ?, ?)',
      article_id,
      user_id,
      value
    );
    return fields;
  };

  updateOne = async ({ article_id, user_id, value }: Rating) => {
    const [[fields]] = await super.execute(
      'UPDATE ratings SET value = ? WHERE article_id = ? AND user_id = ?',
      value,
      article_id,
      user_id
    );
    return fields;
  };
};
