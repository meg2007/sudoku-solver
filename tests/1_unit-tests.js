const chai = require('chai');
const assert = chai.assert;

import { puzzlesAndSolutions } from '../controllers/puzzle-strings.js'; 
const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {

    setup(function() {
        solver = new SudokuSolver();
      });

  // Test puzzle string validation
  test('Logic handles a valid puzzle string of 81 characters', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.validate(puzzle));
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    assert.isFalse(solver.validate(puzzle));
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
    assert.isFalse(solver.validate(puzzle));
  });

  // Test row placement checking
  test('Logic handles a valid row placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 0, '3'));
  });

  test('Logic handles an invalid row placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 0, '1'));  // Row already contains 1
  });

  // Test column placement checking
  test('Logic handles a valid column placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, '3')); // Checking column 1 instead
  });

  test('Logic handles an invalid column placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkColPlacement(puzzle, 0, 0, '1'));  // Column already contains 1
  });

  // Test region (3x3) placement checking
  test('Logic handles a valid region (3x3 grid) placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 0, '3'));
  });

  test('Logic handles an invalid region (3x3 grid) placement', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 0, '5'));  // Region already contains 5
  });

  // Test solving the puzzle
  test('Valid puzzle strings pass the solver', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solved = solver.solve(puzzle);
    assert.isString(solved);
    assert.equal(solved.length, 81);
    assert.isTrue(solver.validate(solved));
  });

  test('Invalid puzzle strings fail the solver', function() {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3';
    const solved = solver.solve(puzzle);
    assert.isNull(solved);
  });

  test('Solver returns the expected solution for a valid puzzle', function() {
    puzzlesAndSolutions.forEach(([puzzle, expectedSolution]) => {
      const result = solver.solve(puzzle);
      assert.strictEqual(result, expectedSolution);
    });
  });
});
