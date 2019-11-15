// @flow
const mysql = require('mysql2/promise');
const DAO = require('./DAO');

type User = {
  user_id: number,
  name: string,
  password: string
}

module.exports = class UserDAO extends DAO {
  constructor(pool: mysql.PromisePool) {
    super(pool);
  }

  getOne = async (id: number): Promise<User> => {
    const [[rows]] = await super.execute('SELECT user_id, name, admin FROM users WHERE user_id = ?', id);
    return rows[0];
  };

  getOneByName = async (name: string): Promise<User> => {
    const [[rows]] = await super.execute('SELECT user_id, name, admin, password FROM users WHERE name = ?', name);
    return rows[0];
  };

  addOne = async ({name, password} : {name: string, password: string}) => {
    const [[fields]] = await super.execute('INSERT INTO users(name, password) VALUES (?, ?)', name, password);
    return fields;
  }

};
