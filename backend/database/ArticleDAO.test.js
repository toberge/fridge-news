// @flow

const mysql = require('mysql2/promise');
const [ pool, runSQL, setup ]: [ mysql.PromisePool, any, any ] = require('./setupTestData');

beforeAll(async done => {
  // fails timeout if run w/o DB, but it's fine
  try {
    await setup();
  } catch (e) {
    console.error(e);
  }
  done();
});

afterAll(done => {
  pool.end();
  done();
});

// describe('getOne()', () => {
//
//   it('goes well', async done => {
//     // TODO
//     done();
//   });
//
// });

// TODO this is executed BEFORE beforeAll
//  i am officially dead soon

test('something', done => {
  done();
});
