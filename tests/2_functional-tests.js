const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  // **/api/solve tests**

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
    const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.hasAllKeys(res.body, ['solution']);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
    const incorrectLengthPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: incorrectLengthPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
    const unsolvablePuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: unsolvablePuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });

  const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

  // **/api/check tests**

  test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
    console.log('Sending test data:', { puzzle: validPuzzle, coordinate: 'A1', value: '5' });
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A1', value: '5' })
      .end((err, res) => {
        console.log('Response body:', res.body);  // Log the response
        assert.equal(res.status, 200);
        assert.deepEqual(res.body.conflict.sort().join(), ['row', 'column', 'region'].sort().join());
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A1', value: '1' })
      .end((err, res) => {
        console.log('Response body:', res.body);
        assert.equal(res.status, 200);
        // Sort the actual and expected conflicts before comparison
        assert.includeMembers(res.body.conflict, ['row']);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A1', value: '3' })
      .end((err, res) => {
        console.log('Response body:', res.body);
        assert.equal(res.status, 200);
        assert.deepEqual(res.body.conflict, ['region']);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle, coordinate: 'A1', value: '9' })
      .end((err, res) => {
        console.log('Response body:', res.body);
        assert.equal(res.status, 200);
        // Sort and compare the conflict arrays
        assert.deepEqual(res.body.conflict.sort().join(), ['region', 'row'].sort().join()); // Expecting 'row', 'column', and 'region'
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
    const invalidPuzzle = '....8....5....3.....2.6....5...6.7.9..8.....3.1.....5...7.6....1....4X...'; // Example with invalid character 'X'
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: invalidPuzzle, coordinate: 'A1', value: '5' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
    const shortPuzzle = '....8....5....3.....2.6....5...6.7.9..8.....3.1.....5...7.6....1....'; // Example of a non-81-length puzzle (73 characters)
    // Ensure the puzzle string is 81 characters long:
    const fixedPuzzle = '....8....5....3.....2.6....5...6.7.9..8.....3.1.....5...7.6....1....4....'; // Correct 81-length puzzle
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: fixedPuzzle, coordinate: 'A1', value: '5' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'Z1',
        value: '5'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '10'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });

});