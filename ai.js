function ticTacToeAIFunction (ticTacToeGame) {

  let arrayElem = ticTacToeGame.getArrayElem();

  return {

    findBestMove : function () {
      let bestMove, bestMoveVal = 0;
      let isMaxMove = ticTacToeGame.getTurn() === ticTacToeGame.turnEnum.CROSS ? true : false;
      for(let i=0;i<ticTacToeGame.getSize();i++) {
        for(let j=0;j<ticTacToeGame.getSize();j++){
          if(arrayElem[i][j] === 0) {
            arrayElem[i][j] = isMaxMove? 1 : -1;
            let val = this.minimax(!isMaxMove);
            if(isMaxMove) {
              if(val >= bestMoveVal){
                bestMoveVal = val;
                bestMove = (3 * i) + (j+1);
              }
            } else {
              if(val <= bestMove){
                bestMoveVal = val;
                bestMove = (3 * i) + (j+1);
              }
            }
            arrayElem[i][j] = 0;
          }
        }
      }
      return bestMove;
    },

    minimax : function (isMaxMove) {

      //if game finished
      let val = ticTacToeGame.checkGameLongWay();
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
        for(let i=0;i<ticTacToeGame.getSize();i++) {
          for(let j=0;j<ticTacToeGame.getSize();j++){
            if(arrayElem[i][j] === 0) {
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
        for(let i=0;i<ticTacToeGame.getSize();i++) {
          for(let j=0;j<ticTacToeGame.getSize();j++){
            if(arrayElem[i][j] === 0) {
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
