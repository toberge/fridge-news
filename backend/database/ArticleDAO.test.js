// @flow

const mysql = require('mysql2/promise');
const [ pool, runSQL, setup ]: [ mysql.PromisePool, any, any ] = require('./setupTestData');

beforeAll(() => {
  return setup();
});

afterAll(done => {
  pool.end(() => done());
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
