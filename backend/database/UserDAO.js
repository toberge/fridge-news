// @flow
const mysql = require('mysql2/promise');
const DAO = require('./DAO');

type PostUser = {
  user_id: number,
  name: string,
  password: string
};

type GetUser = {
  user_id: number,
  name: string,
  admin: boolean
}

module.exports = class UserDAO extends DAO {
  constructor(pool: mysql.PromisePool) {
    super(pool);
  }

  getAll = async (): Promise<GetUser[]> => {
    const [[rows]] = await super.execute('SELECT user_id, name, admin FROM users');
    return rows;
  };

  getOne = async (id: number): Promise<GetUser> => {
    const [[rows]] = await super.execute('SELECT user_id, name, admin FROM users WHERE user_id = ?', id);
    return rows[0];
  };

  // returns password since it's used for authentication
  getOneByName = async (name: string): Promise<GetUser & PostUser> => {
    const [[rows]] = await super.execute('SELECT user_id, name, admin, password FROM users WHERE name = ?', name);
    return rows[0];
  };

  addOne = async ({ name, password }: { name: string, password: string }) => {
    const [[fields]] = await super.execute('INSERT INTO users(name, password) VALUES (?, ?)', name, password);
    return fields;
  };
};
