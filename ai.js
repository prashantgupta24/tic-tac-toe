//http://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
function ticTacToeAI (ticTacToeGame) {

  return {

    findBestMove : function () {
      let bestMove, bestMoveVal = 0;
      let isMaxMove = ticTacToeGame.turn === ticTacToeGame.turnEnum.CROSS ? true : false;
      for(let i=0;i<ticTacToeGame.size;i++) {
        for(let j=0;j<ticTacToeGame.size;j++){
          if(ticTacToeGame.arrayElem[i][j] === 0) {
            ticTacToeGame.arrayElem[i][j] = isMaxMove? 1 : -1;
            let val = this.minimax(!isMaxMove);
            if(isMaxMove) {
              if(val > bestMoveVal){
                bestMoveVal = val;
                bestMove = (3 * i) + (j+1);
              }
            } else {
              if(val < bestMove){
                bestMoveVal = val;
                bestMove = (3 * i) + (j+1);
              }
            }
            ticTacToeGame.arrayElem[i][j] = 0;
          }
        }
      }
      return bestMove;
    },

    findBestMove1 : function() {
      return 'test123';
    },

    // this.evaluate = function () {
    //   return val;
    // };

    minimax : function (isMaxMove) {

      //if game finished
      let val = ticTacToeGame.checkGameLong();
      if(Math.abs(val) === 3) {
        if(val === 3) {
          return 10;
        }
        else {
          return -10;
        }
      }

      if(!ticTacToeGame.movesLeft()) {
        return 0;
      }

      if(isMaxMove) {
        let bestVal = -1000;
        for(let i=0;i<ticTacToeGame.size;i++) {
          for(let j=0;j<ticTacToeGame.size;j++){
            if(ticTacToeGame.arrayElem[i][j] === 0) {
              ticTacToeGame.arrayElem[i][j] = 1;
              //ticTacToeGame.turn = ticTacToeGame.turnEnum.CIRCLE;
              bestVal = Math.max(this.minimax(!isMaxMove), bestVal);
              ticTacToeGame.arrayElem[i][j] = 0;
            }
          }
        }
        return bestVal;
      } else {
        let bestVal = 1000;
        for(let i=0;i<ticTacToeGame.size;i++) {
          for(let j=0;j<ticTacToeGame.size;j++){
            if(ticTacToeGame.arrayElem[i][j] === 0) {
              ticTacToeGame.arrayElem[i][j] = -1;
              //ticTacToeGame.turn = ticTacToeGame.turnEnum.CROSS;
              bestVal = Math.min(this.minimax(!isMaxMove), bestVal);
              ticTacToeGame.arrayElem[i][j] = 0;
            }
          }
        }
        return bestVal;
      }

    }

    // return {
    //   findBestMove:findBestMove,
    //   findBestMove1:findBestMove1
  };
}
