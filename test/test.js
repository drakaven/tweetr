const assert = require('assert');
const request = require('request');
describe('Test Test', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});


describe('Connection Test', function () {
  it('should return 200', function (done) {
    let options = {
      url: 'http://localhost:8080',
      headers: {
        'Content-Type': 'text/plain'
      }
    };
    request.get(options, function (err, res, body) {
      assert(res.statusCode === 200);
      done();
    });
  });
});

describe('Connection Tweets', function () {
  it('should return 200', function (done) {
    let options = {
      url: 'http://localhost:8080/tweets',
      headers: {
        'Content-Type': 'text/plain'
      }
    };
    request.get(options, function (err, res, body) {
      assert(res.statusCode === 200);
      assert(typeof(JSON.parse(res.body)) === 'object');
      done();
    });
  });
});