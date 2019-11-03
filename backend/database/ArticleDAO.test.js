// @flow

const mysql = require('mysql2/promise');
const [pool, setup]: [mysql.PromisePool, any] = require('./setupTestData');
const ArticleDAO = require('./ArticleDAO');

const articleDAO = new ArticleDAO(pool);

beforeAll(() => {
  return setup();
});

afterAll(() => {
  pool.end();
  // to inform you: don't pass a callback to end() again.
});

const TITLE = 'Fridge Found Floating in Space';
const TESLA_TITLE = 'One Thousand Teslas Found Outside the Solar System';

describe('ArticleDAO', () => {
  describe('.getAll()', () => {
    it('gives correctly sorted articles', async () => {
      const articles = await articleDAO.getFrontPage();
      // TODO decide sorting order for this query if you ever use it
      console.log(articles);
      expect(articles[0].title).toBe(TITLE);
    });
  });

  describe('.getFrontPage()', () => {
    it('gives correctly sorted articles', async () => {
      const articles = await articleDAO.getFrontPage();
      // is 2nd in creation here, 1st if filtered by importance and sorted by recency
      expect(articles[0].title).toBe(TITLE);
    });
  });

  describe('.getByCategory()', () => {
    it('gives correct set of articles', async () => {
      const articles = await articleDAO.getByCategory('science');
      // only one in that category anyway
      expect(articles[0].title).toBe(TESLA_TITLE);
    });
  });

  describe('.getOne()', () => {
    it('fetches correct article', async () => {
      const article = await articleDAO.getOne(2);
      expect(article.title).not.toBeUndefined();
      expect(article.title).toBe(TITLE);
      expect(article.article_id).toBe(2);
    });
  });

  describe('.deleteOne()', () => {
    it('deletes an article', async () => {
      const {affectedRows} = await articleDAO.deleteOne(3);
      expect(affectedRows).toBe(1);
    });
    it('fails if nonexistent ID', async () => {
      // throw syntax for later
      // await expect(articleDAO.deleteOne(42)).rejects.toThrow();
      const {affectedRows} = await articleDAO.deleteOne(42);
      expect(affectedRows).toBe(0);
    });
  });

  describe('.addOne()', () => {
    it('inserts data', async () => {
      const {insertId, affectedRows} = await articleDAO.addOne({
        user_id: 1,
        title: 'Two Birds with One Stone',
        picture_path: null,
        picture_alt: null,
        picture_caption: 'hello there',
        content: 'Desperation',
        importance: 2,
        category: 'culture'
      });
      expect(affectedRows).toBe(1);
      // we know we didn't delete more than 1 --> total 2 is safe
      expect(insertId).toBeGreaterThan(2);
    });
  });

  describe('.updateOne()', () => {
    it('actually updates stored data', async () => {
      const {affectedRows} = await articleDAO.updateOne({
        article_id: 1,
        title: TESLA_TITLE, // shan't break other test
        picture_path: null,
        picture_alt: null,
        picture_caption: 'this shall not be here',
        content: 'elon is not ok',
        importance: 2,
        category: 'science'
      });
      expect(affectedRows).toBe(1);
      // verify that data was changed correctly
      const article = await articleDAO.getOne(1);
      expect(article.content).toBe('elon is not ok');
      // since we can have articles w/o picture, the caption should be ignored
      expect(article.picture_caption).toBe(null);
      // since it was updated, it should have an update time
      expect(article.update_time).not.toBe(null);
    });
  });
});


