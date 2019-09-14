/* eslint-env mocha */
const assert = require('chai').assert;
/*
const thingToTest = require('../thing.js');
in thing.js:
module.exports = some class or function or { things }

it's possible to add /!* eslint-env mocha *!/ to avoid standard's problems
can set --env mocha/jest when running, but using comments instead
to have it only count for the actual tests
*/

describe('Thing', () => {
  before(done => {
    // setting things up...
    done(); // pass this as callback if needed
  });

  beforeEach(done => {
    // per-test setup
    done();
  });

  // after and afterEach exist too

  describe('thatMethod()', () => {
    it('should return something awful when unhappy', () => {
      // pass result var from here or outside or wherever fits
      const result = 'aw' + 'ful';
      assert.equal(result, 'awful');
    });
  });

  describe('thisMethod()', () => {
    it('should return something else', () => {
      // pass result var from here or outside or wherever fits
      const result = 'something else';
      assert.equal(result, 'something else');
    });
  });
});
