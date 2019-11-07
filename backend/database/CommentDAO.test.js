// @flow

const mysql = require('mysql2/promise');
const [pool, setup]: [mysql.PromisePool, any] = require('./setupTestData');
const CommentDAO = require('./CommentDAO');

const commentDAO = new CommentDAO(pool);

beforeAll(() => {
  return setup();
});

afterAll(() => {
  pool.end();
});

describe('CommentDAO', () => {
  describe('.getOne()', () => {
    it('finds the comment', async () => {
      // not needed in actual system tho...
      const comment = await commentDAO.getOne(1);
      expect(comment.title).toBe('Some text');
    });
  });

  describe('.getByArticle()', () => {
    it('finds correctly sorted comments for one article', async () => {
      const comments = await commentDAO.getByArticle(1);
      expect(comments[0].user_id).toBe(2);
      expect(comments[1].user_id).toBe(1);
    });
  });

  describe('.addOne()', () => {
    it('posts a comment', async () => {
      const comment = { article_id: 1, user_id: 2, content: 'There is nothing to like about this article' };
      const fields = await commentDAO.addOne(comment);
      expect(fields.affectedRows).toBe(1);
      expect(fields.insertId).toBeGreaterThan(2);
      // verify data
      const found = await commentDAO.getOne(fields.insertId);
      expect(found.content).toEqual(comment.content);
      expect(found.user_id).toEqual(comment.user_id);
    });
  });
});
