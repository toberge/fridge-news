// @flow

const mysql = require('mysql2/promise');
const [pool, setup]: [mysql.PromisePool, any] = require('./setupTestData');
const RatingDAO = require('./RatingDAO');

const ratingDAO = new RatingDAO(pool);

beforeAll(() => {
  return setup();
});

afterAll(() => {
  pool.end();
});

describe('RatingDAO', () => {
  describe('.getOne()', () => {
    it('gets the correct rating', async () => {
      const rating = await ratingDAO.getOne(1, 3);
      expect(rating.article_id).toBe(1);
      expect(rating.user_id).toBe(3);
      expect(rating.value).toBe(5);
    });

    it('fails at invalid ID pair', async () => {
      await expect(ratingDAO.getOne(99, 68)).rejects.toThrow()
    });
  });

  describe('.addOne()', () => {
    it('adds a rating to an article', async () => {
      const rating = { article_id: 2, user_id: 2, value: 4 };
      const fields = await ratingDAO.addOne(rating);
      expect(fields.affectedRows).toBe(1);
    });
  });

  describe('.updateOne()', () => {
    it('updates a rating', async () => {
      // from 3 to 4
      const rating = { article_id: 1, user_id: 2, value: 4 };
      const fields = await ratingDAO.updateOne(rating);
      expect(fields.affectedRows).toBe(1);
    });
  });
});
