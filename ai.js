function ticTacToeAIFunction(ticTacToeGame) {

  let arrayElem = ticTacToeGame.getArrayElem();
  let size = ticTacToeGame.getSize();

  let checkGame = function() {

    //rows
    for (let i = 0; i < size; i++) {
      let val = 0;
      for (let j = 0; j < size; j++) {
        val += arrayElem[i][j];
        if (Math.abs(val) === 3) {
          return val;
        }
      }
    }

    //columns
    for (let i = 0; i < size; i++) {
      let val = 0;
      for (let j = 0; j < size; j++) {
        val += arrayElem[j][i];
        if (Math.abs(val) === 3) {
          return val;
        }
      }
    }

    //d1
    let val = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === j) {
          val += arrayElem[i][j];
        }
        if (Math.abs(val) === 3) {
          return val;
        }
      }
    }

    //d2
    val = 0;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i + j === 2) {
          val += arrayElem[i][j];
        }
        if (Math.abs(val) === 3) {
          return val;
        }
      }
    }

  };

  let movesLeft = function() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (arrayElem[i][j] === 0)
          return true;
      }
    }
    return false;
  };

  return {

    findBestMove: function() {
      let bestMove, bestMoveVal = 0;
      let isMaxMove = ticTacToeGame.getTurn() === ticTacToeGame.turnEnum.CROSS ? true : false;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (arrayElem[i][j] === 0) {
            arrayElem[i][j] = isMaxMove ? 1 : -1;
            let val = this.minimax(!isMaxMove);
            if (isMaxMove) {
              if (val >= bestMoveVal) {
                bestMoveVal = val;
                bestMove = (3 * i) + (j + 1);
              }
            } else {
              if (val <= bestMove) {
                bestMoveVal = val;
                bestMove = (3 * i) + (j + 1);
              }
            }
            arrayElem[i][j] = 0;
          }
        }
      }
      return bestMove;
    },

    minimax: function(isMaxMove) {

      //if game finished
      let val = checkGame();
      if (Math.abs(val) === 3) {
        if (val === 3) {
          return 10;
        } else {
          return -10;
        }
      }

      if (!movesLeft()) {
        return 0;
      }

      if (isMaxMove) {
        let bestVal = -1000;
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (arrayElem[i][j] === 0) {
              arrayElem[i][j] = 1;
              //ticTacToeGame.turn = ticTacToeGame.turnEnum.CIRCLE;
              bestVal = Math.max(this.minimax(!isMaxMove), bestVal);
              arrayElem[i][j] = 0;
            }
          }
        }
        return bestVal;
      } else {
        let bestVal = 1000;
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (arrayElem[i][j] === 0) {
              arrayElem[i][j] = -1;
              //ticTacToeGame.turn = ticTacToeGame.turnEnum.CROSS;
              bestVal = Math.min(this.minimax(!isMaxMove), bestVal);
              arrayElem[i][j] = 0;
            }
          }
        }
        return bestVal;
      }
    }
  };
}
