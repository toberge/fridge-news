// @flow
const mysql = require('mysql2/promise');
const DAO = require('./DAO');

type MinimalArticle = {
  title: string,
  picture_path: string | null,
  picture_alt: string | null,
  picture_caption: string | null,
  content: string,
  importance: 1 | 2,
  category: string
};

type Article = {
  article_id: number,
  user_id: number,
  upload_time: string,
  update_time: string,
  rating: number
} & MinimalArticle;

module.exports = class ArticleDAO extends DAO {
  constructor(pool: mysql.PromisePool) {
    super(pool);
  }

  // TODO search method

  getAll = async () => {
    const [[rows]] = await super.query('SELECT * FROM articles_view');
    return rows;
  };

  getFrontPage = async () => {
    const [[rows]] = await super.query('SELECT * FROM front_page');
    return rows;
  };

  getByCategory = async (category: string) => {
    const [[rows]] = await super.execute('SELECT * FROM articles_condensed WHERE category = ?', category);
    return rows;
  };

  /**
   * Fetches an article from DB
   * based on ID.
   *
   * @param id - id of article
   * @returns {Promise<Article>}
   */
  getOne = async (id: number): Promise<Article> => {
    const [[rows]] = await super.execute('SELECT * FROM articles_view WHERE article_id = ?', id);
    return rows[0];
  };

  deleteOne = async (id: number) => {
    const [[fields]] = await super.execute('DELETE FROM articles WHERE article_id = ?', id);
    return fields;
  };

  /**
   * Adds an article to database table,
   * ignoring picture data if none is provided.
   *
   * @param user_id
   * @param title
   * @param picture_path
   * @param picture_alt
   * @param picture_caption
   * @param content
   * @param importance
   * @param category
   * @returns {Promise<*>}
   */
  addOne = async ({
    user_id,
    title,
    picture_path,
    picture_alt,
    picture_caption,
    content,
    importance,
    category
  }: { user_id: number } & MinimalArticle) => {
    let fields = null;
    if (picture_path && picture_alt && picture_caption) {
      const [[fluff]] = await super.execute(
        'INSERT INTO articles(user_id, title, picture_path, picture_alt, picture_caption, content, importance, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        user_id,
        title,
        picture_path,
        picture_alt,
        picture_caption,
        content,
        importance,
        category
      );
      fields = fluff;
    } else {
      const [[fluff]] = await super.execute(
        'INSERT INTO articles(user_id, title, content, importance, category) VALUES (?, ?, ?, ?, ?)',
        user_id,
        title,
        content,
        importance,
        category
      );
      fields = fluff;
    }
    return fields;
  };

  /**
   * Update the content of an article,
   * ignoring picture data if none is provided.
   * TODO remove picture if none? sure?
   *
   * @param article_id
   * @param title
   * @param picture_path
   * @param picture_alt
   * @param picture_caption
   * @param content
   * @param importance
   * @param category
   * @returns {Promise<*>}
   */
  updateOne = async ({
    article_id,
    title,
    picture_path,
    picture_alt,
    picture_caption,
    content,
    importance,
    category
  }: { article_id: number } & MinimalArticle) => {
    let fields = null;
    if (picture_path && picture_alt && picture_caption) {
      const [[fluff]] = await super.execute(
        'UPDATE articles SET title = ?, picture_path = ?, picture_alt = ?, picture_caption = ?, content = ?, importance = ?, category = ? WHERE article_id = ?',
        title,
        picture_path,
        picture_alt,
        picture_caption,
        content,
        importance,
        category,
        article_id
      );
      fields = fluff;
    } else {
      const [[fluff]] = await super.execute(
        'UPDATE articles SET title = ?, content = ?, importance = ?, category = ? WHERE article_id = ?',
        title,
        content,
        importance,
        category,
        article_id
      );
      fields = fluff;
    }
    return fields;
  };
};
