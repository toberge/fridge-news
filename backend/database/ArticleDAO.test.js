// @flow

const mysql = require('mysql2/promise');
const [ pool, runSQL, setup ]: [ mysql.PromisePool, any, any ] = require('./setupTestData');

beforeAll(done => {
  // fails timeout if run w/o DB, but it's fine
  setup().then(res => done());
});

afterAll(done => {
  pool.end();
});

describe('getOne()', () => {

  it('goes well', async done => {
    // TODO
    done();
  });

});
