'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  const isValidPuzzle = (puzzle) => {
    const regex = /^[1-9\.]{81}$/; // Only allows digits 1-9 and '.' characters
    return regex.test(puzzle);
  };

  app.route('/api/check')
    .post((req, res) => {

      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
  
      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ valid: false, error: 'Invalid characters in puzzle' });
      }
  
      if (puzzle.length !== 81) {
        return res.json({ valid: false, error: 'Expected puzzle to be 81 characters long' });
      }
  
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
  
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
  
      let rowNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
      let row = rowNames.indexOf(coordinate[0]);
      let column = parseInt(coordinate[1], 10) - 1;
  
      let currentValue = puzzle[row * 9 + column];
  
      // If the provided value is already in the position, return valid.
      if (currentValue === value) {
        return res.json({ valid: true });
      }
  
      let conflict = [];
  
      // Check for row conflict
      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflict.push("row");
      }
  
      // Check for column conflict
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflict.push("column");
      }
  
      // Check for region conflict
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflict.push("region");
      }
  
      // Adjust the response based on the conflict type:
      if (conflict.length === 0) {
        return res.json({ valid: true });
      } else {
        // Ensure only relevant conflicts are returned based on the test case
        // Adjust these checks to match the expected conflict responses
        if (conflict.length === 1) {
          // Only return the single conflict type if it's a single conflict
          return res.json({ valid: false, conflict: [conflict[0]] });
        } else {
          // If there are multiple conflicts, return all conflicts
          return res.json({ valid: false, conflict });
        }
      }
    });


  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      // Check for missing puzzle
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      // Validate the length of the puzzle
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

    // Check for invalid characters in the puzzle
    if (/[^1-9.]/.test(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    // Validate the puzzle
    let validatePuzzle = solver.validate(puzzle);
    if (validatePuzzle !== true) {
      return res.json(validatePuzzle);
    }

      // Solve the puzzle
      let solution = solver.solve(puzzle);

      // Return error if puzzle cannot be solved
      if (!solution || solution === 'No solution') {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      // Return solved puzzle
      return res.json({ solution });
    });
};