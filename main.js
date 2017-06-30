$(function() {
  //console.log('ready');
  let ticTacToeGame = ticTacToe(3); //main value, sets size of the game board (size * size)
  ticTacToeGame.initialize();

  let ticTacToeAI = ticTacToeAIFunction(ticTacToeGame);

  $(document).keypress(function(event) {
    if (ticTacToeGame.isPlaying()) {
      let keyCode = event.which || event.keyCode;
      //console.log(keyCode);
      let validMove = false;
      if (keyCode >= 49 && keyCode <= 57) {
        validMove = ticTacToeGame.playMove(String.fromCharCode(keyCode));
      }
      if (ticTacToeGame.isPlaying() && validMove) {
        let moveByAI = ticTacToeAI.findBestMove();
        ticTacToeGame.playMove(moveByAI);
      }
    }
  });

  // ticTacToeGame.arrayElem[0][0]=1;
  // ticTacToeGame.arrayElem[0][1]=-1;
  // ticTacToeGame.arrayElem[0][2]=1;

  //ticTacToeGame.arrayElem[1][0]=-1;
  //ticTacToeGame.arrayElem[1][1]=-1;
  //ticTacToeGame.arrayElem[1][2]=1;

  //ticTacToeGame.arrayElem[2][0]=-1;
  //ticTacToeGame.arrayElem[2][1]=-1;
  //ticTacToeGame.arrayElem[2][2]=1;

  // let ticTacToeAI = ticTacToeAIFunction(ticTacToeGame);
  // console.log(ticTacToeAI.findBestMove());
});

Array.matrix = function(numRows, numCols, initial) {
  var arr = [];
  for (var i = 0; i < numRows; ++i) {
    var columns = [];
    for (var j = 0; j < numCols; ++j) {
      columns[j] = initial;
    }
    arr[i] = columns;
  }
  return arr;
};

function ticTacToe(size) {

  let turn = '';
  let grid = {};
  let canvas = {};
  let arrayElem = '';
  let chancesElem = '';
  let playing = false;
  let rows = [];
  let columns = [];
  let d1 = 0;
  let d2 = 0;
  let numMoves = 0;

  let getSize = function() {
    return size;
  };

  let isPlaying = function() {
    return playing;
  };

  let setPlaying = function(isPlaying) {
    playing = isPlaying;
  };

  let getTurn = function() {
    return turn;
  };

  let setTurn = function(setTurn) {
    turn = setTurn;
  };

  let getArrayElem = function() {
    return arrayElem;
  };

  let turnEnum = {
    CROSS: 'CROSS',
    CIRCLE: 'CIRCLE',
    getValue: function(turn) {
      if (turn === this.CROSS) {
        return 1;
      } else {
        return -1;
      }
    }
  };

  let initialize = function() {
    canvas = createCanvas(grid);
    canvas.initializeCanvas(size);
    arrayElem = Array.matrix(size, size, 0),
      chancesElem = $('#chances');
    setPlaying(true);
    setTurn(turnEnum.CIRCLE);
    numMoves = 0;
    chancesElem.html(getTurn());
    initializeArrays();
  };

  let initializeArrays = function() {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        arrayElem[i][j] = 0;
        rows[j] = 0;
        columns[j] = 0;
      }
    }
  };

  let playMove = function(quad) {

    let xVal = Math.floor((quad - 1) / size);
    let yVal = Math.floor((quad - 1)) % size;

    if (arrayElem[xVal][yVal] != 0) {
      alert('That spot is filled!');
      return false;
    } else {
      numMoves += 1;
      arrayElem[xVal][yVal] = getTurn() === turnEnum.CROSS ? 1 : -1;
      drawObject(yVal, xVal);
      let gameWon = checkGame(xVal, yVal);

      if (gameWon) {
        setTimeout(function() {
          alert(getTurn() + ' won!');
        }, 100);
        setPlaying(false);
      } else if (numMoves === size * size) {
        setTimeout(function() {
          alert('Game draw!');
        }, 100);
        setPlaying(false);
      } else {
        setTurn(getTurn() === turnEnum.CIRCLE ? turnEnum.CROSS : turnEnum.CIRCLE);
        chancesElem.html(getTurn());
      }
      return true;
    }
  };

  let checkGame = function(i, j) {
    let val = turnEnum.getValue(getTurn());
    rows[i] += val;
    columns[j] += val;
    if (i === j) {
      d1 += val;
    }
    if ((i + j) === size - 1) {
      d2 += val;
    }
    // console.log('R : '+rows);
    // console.log('C : ' + columns);
    // console.log('d1 : ' + d1);
    // console.log('d2 : ' + d2);

    if (Math.abs(rows[i]) === size || Math.abs(columns[j]) === size ||
      Math.abs(d1) === size || Math.abs(d2) === size) {
      return true;
    }
  };

  let drawObject = function(xVal, yVal) {

    // let xVal = Math.floor((quad-1))%3;
    // let yVal = Math.floor((quad-1)/3);

    let threshold = 20;

    let p1 = new Point(grid['x' + (xVal + 1)] + threshold, grid['y' + (yVal + 1)] + threshold);
    let p2 = new Point(grid['x' + (xVal + 1)] + threshold, grid['y' + (yVal + 2)] - threshold);
    let p3 = new Point(grid['x' + (xVal + 2)] - threshold, grid['y' + (yVal + 1)] + threshold);
    let p4 = new Point(grid['x' + (xVal + 2)] - threshold, grid['y' + (yVal + 2)] - threshold);

    // console.log('x between ' + (xVal+1) + ' and ' + (xVal+2));
    // console.log('y between ' + (yVal+1) + ' and ' + (yVal+2));
    if (getTurn() === turnEnum.CIRCLE) {
      canvas.drawCircle(p1, p2, p3, p4);
    } else {
      canvas.drawCross(p1, p2, p3, p4);
    }
  };

  return {
    getArrayElem: getArrayElem,
    turnEnum: turnEnum,
    isPlaying: isPlaying,
    getSize: getSize,
    getTurn: getTurn,
    initialize: initialize,
    playMove: playMove,
  };
}

function createCanvas(gameGrid) {

  let canvasElement = document.getElementById('wordCanvas');
  let ctx = document.getElementById('wordCanvas').getContext('2d');

  let initializeCanvas = function(numRows) {
    let numRowsForGrid = numRows + 2;
    let widthPerColumn = Math.floor(canvasElement.width / numRowsForGrid);
    let heightPerRow = Math.floor(canvasElement.height / numRowsForGrid);
    //console.log(heightPerRow);

    for (let i = 1; i < numRowsForGrid; i++) {
      //console.log(i*widthPerColumn);
      gameGrid['x' + (i)] = i * widthPerColumn;
    }

    for (let i = 1; i < numRowsForGrid; i++) {
      //console.log(i*heightPerRow);
      gameGrid['y' + (i)] = i * heightPerRow;
    }

    //horizontal lines
    for (let i = 2; i <= numRows; i++) {
      let p1 = new Point(gameGrid.x1, gameGrid['y' + (i)]);
      let p2 = new Point(gameGrid['x' + (numRows + 1)], gameGrid['y' + (i)]);
      drawPoints(p1, p2);
    }

    //vertical lines
    for (let i = 2; i <= numRows; i++) {
      let p1 = new Point(gameGrid['x' + (i)], gameGrid.y1);
      let p2 = new Point(gameGrid['x' + (i)], gameGrid['y' + (numRows + 1)]);
      drawPoints(p1, p2);
    }
  };

  let drawPoints = function(p1, p2) {
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  };

  let drawCross = function(p1, p2, p3, p4) {
    drawPoints(p1, p4);
    drawPoints(p2, p3);
  };

  let drawCircle = function(p1, p2, p3, p4) {
    let centreX = (p1.x + p4.x) / 2;
    let centreY = (p1.y + p4.y) / 2;
    let radius = (p4.x - p1.x) < (p4.y - p1.y) ? (p4.x - p1.x) / 2 : (p4.y - p1.y) / 2;

    ctx.beginPath();
    ctx.arc(centreX, centreY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  let clearCanvas = function() {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //console.log('canvas cleared');
  };
  return {
    initializeCanvas: initializeCanvas,
    drawCross: drawCross,
    drawCircle: drawCircle,
    clearCanvas: clearCanvas
  };
}

let Point = function(x, y) {
  this.x = x;
  this.y = y;
};
