class SudokuSolver {
  
  validate(puzzleString) {
    return /^[1-9.]{81}$/.test(puzzleString);
  }

  checkRowPlacement(puzzle, row, column, value) {
    const rowStart = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzle[rowStart + i] === value) {
        return false; // Value already exists in this row
      }
    }
    return true; // No conflict
  }

  checkColPlacement(puzzle, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzle[i * 9 + column] === value) {
        return false; // Conflict found in the column
      }
    }
    return true; // No conflict
  }

  checkRegionPlacement(puzzle, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (puzzle[(startRow + i) * 9 + (startCol + j)] === value) {
          return false; // Value already exists in this region
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return null; // Return null for invalid puzzles
    }
  
    let puzzle = puzzleString.split('');
  
    const backtrack = () => {
      const emptyCellIndex = puzzle.indexOf('.');
      if (emptyCellIndex === -1) {
        return puzzle.join('');
      }
      
      const row = Math.floor(emptyCellIndex / 9);
      const col = emptyCellIndex % 9;
    
      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (
          this.checkRowPlacement(puzzle, row, col, value) &&
          this.checkColPlacement(puzzle, row, col, value) &&
          this.checkRegionPlacement(puzzle, row, col, value)
        ) {
          puzzle[emptyCellIndex] = value;
      
          const result = backtrack();
          if (result) return result;
          
          puzzle[emptyCellIndex] = '.'; // Backtrack
        }
      }
    
      return null;
    };
  
    const solution = backtrack();
    return solution || 'No solution';
  }
}

module.exports = SudokuSolver;