// @flow

const mysql = require('mysql2/promise');
const [pool, setup]: [mysql.PromisePool, any] = require('./setupTestData');
const UserDAO = require('./UserDAO');

const userDAO = new UserDAO(pool);

beforeAll(() => {
  return setup();
});

afterAll(() => {
  pool.end();
});

describe('UserDAO', () => {
  describe('.getAll()', () => {
    it('finds the correct set of users', async () => {
      const users = await userDAO.getAll();
      expect(users[0].name).toBe('The Fridge');
      expect(users[2].name).toBe('Colonel Sanders');
    });
  });

  describe('.getOne()', () => {
    it('finds the correct user', async () => {
      const user = await userDAO.getOne(1);
      expect(user.user_id).toBe(1);
      expect(user.name).toBe('The Fridge');
    });
  });

  describe('.getOneByName()', () => {
    it('finds the correct user', async () => {
      const user = await userDAO.getOneByName('The Fridge');
      expect(user.user_id).toBe(1);
      expect(user.name).toBe('The Fridge');
    });
  });

  describe('.addOne()', () => {
    it('adds a user', async () => {
      const user = { name: 'Lech Walesa', password: '222u4g82hg92ufc8u982u4g' };
      const fields = await userDAO.addOne(user);
      expect(fields.affectedRows).toBe(1);
      expect(fields.insertId).toBeGreaterThan(3);
      // verify data
      const found = await userDAO.getOne(fields.insertId);
      expect(found.user_id).toEqual(fields.insertId);
      expect(found.name).toEqual(user.name);
    });
  });
});
