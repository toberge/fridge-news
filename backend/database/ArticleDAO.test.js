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

describe('getOne()', () => {
  it('just works', async () => {
    const article = await articleDAO.getOne(1);
    expect(article.title).not.toBeUndefined();
    expect(article.title).toBe('Fridge Found Floating in Space');
  });
});

describe('addOne()', () => {
  it('works', async () => {
    const { insertId, affectedRows } = await articleDAO.addOne({
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
    expect(insertId).toBeGreaterThan(2);
  });
});
