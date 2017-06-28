
$(function () {
  //console.log('ready');
  //let ticTacToeGame = ticTacToe;

  ticTacToeGame.canvas = {
    canvasElement: document.getElementById('wordCanvas'),
    ctx: document.getElementById('wordCanvas').getContext('2d'),
    initializeCanvas: function(numRows) {
      let numRowsForGrid = numRows + 2;
      let widthPerColumn = Math.floor(this.canvasElement.width/numRowsForGrid);
      let heightPerRow = Math.floor(this.canvasElement.height/numRowsForGrid);
      //console.log(heightPerRow);

      for(let i=1;i<numRowsForGrid;i++) {
        //console.log(i*widthPerColumn);
        ticTacToeGame.grid['x'+(i)] = i*widthPerColumn;
      }

      for(let i=1;i<numRowsForGrid;i++) {
        //console.log(i*heightPerRow);
        ticTacToeGame.grid['y'+(i)] = i*heightPerRow;
      }

      //horizontal lines
      for(let i=2;i<=numRows;i++) {
        let p1 = new Point(ticTacToeGame.grid.x1, ticTacToeGame.grid['y'+(i)]);
        let p2 = new Point(ticTacToeGame.grid['x'+(numRows+1)], ticTacToeGame.grid['y'+(i)]);
        this.drawPoints(p1, p2);
      }

      //vertical lines
      for(let i=2;i<=numRows;i++) {
        let p1 = new Point(ticTacToeGame.grid['x'+(i)], ticTacToeGame.grid.y1);
        let p2 = new Point(ticTacToeGame.grid['x'+(i)], ticTacToeGame.grid['y'+(numRows+1)]);
        this.drawPoints(p1, p2);
      }
    },
    drawPoints: function(p1, p2) {
      this.ctx.moveTo(p1.x,p1.y);
      this.ctx.lineTo(p2.x,p2.y);
      this.ctx.stroke();
    },
    drawCross: function(p1, p2, p3, p4) {
      this.drawPoints(p1, p4);
      this.drawPoints(p2, p3);
    },
    drawCircle: function(p1, p2, p3, p4) {
      let centreX = (p1.x + p4.x)/2;
      let centreY = (p1.y + p4.y)/2;
      let radius = (p4.x - p1.x) < (p4.y - p1.y)? (p4.x - p1.x)/2 : (p4.y - p1.y)/2;

      this.ctx.beginPath();
      this.ctx.arc(centreX,centreY,radius,0,2*Math.PI);
      this.ctx.stroke();
    },
    clearCanvas: function () {
      this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      //console.log('canvas cleared');
    }
  };

  ticTacToeGame.chancesElem = $('#chances');
  ticTacToeGame.initialize();

  $(document).keypress(function (event) {
    if(ticTacToeGame.playing) {
      let keyCode = event.which || event.keyCode;
      //console.log(keyCode);
      if(keyCode >= 49 && keyCode <= 57) {
        ticTacToeGame.playMove(String.fromCharCode(keyCode));
      }
    }
  });

  // ticTacToeGame.arrayElem[0][0]=1;
  // ticTacToeGame.arrayElem[0][1]=-1;
  // ticTacToeGame.arrayElem[1][0]=1;
  // ticTacToeGame.arrayElem[1][1]=-1;
  // ticTacToeGame.arrayElem[0][2]=1;
  // ticTacToeGame.arrayElem[1][2]=-1;

  let ticTacToeAI1 = ticTacToeAI(ticTacToeGame);
  console.log(ticTacToeAI1.findBestMove(0,0));
  //console.log(ticTacToeAI1.findBestMove());
});

Array.matrix = function (numRows, numCols, initial) {
  var arr = [];
  for (var i = 0; i < numRows; ++i){
    var columns = [];
    for (var j = 0; j < numCols; ++j){
      columns[j] = initial;
    }
    arr[i] = columns;
  }
  return arr;
};

let ticTacToeGame = {
  size: 3, //main value, sets size of the game board (size * size)
  grid: {},
  playing: false,
  turnEnum: {
    CROSS: 'CROSS',
    CIRCLE: 'CIRCLE',
    getValue: function (turn) {
      if(turn === this.CROSS) {
        return 1;
      } else {
        return -1;
      }
    }
  },
  turn: '',
  rows: new Array(this.size),
  columns: new Array(this.size),
  d1: 0,
  d2: 0,
  numMoves: 0,
  initialize: function () {
    this.canvas.initializeCanvas(this.size);
    this.arrayElem = Array.matrix(this.size,this.size,0),
    this.playing = true;
    this.turn = this.turnEnum.CROSS;
    this.numMoves = 0;
    this.chancesElem.html(this.turn);
    this.initializeArrays();
  },
  initializeArrays: function () {
    for(let i=0;i<this.size;i++) {
      for(let j=0;j<this.size;j++){
        this.arrayElem[i][j]=0;
        this.rows[j] = 0;
        this.columns[j] = 0;
      }
    }
  },
  playMove: function (quad) {

    let xVal = Math.floor((quad-1)/this.size);
    let yVal = Math.floor((quad-1))%this.size;

    if(this.arrayElem[xVal][yVal] != 0) {
      alert('That spot is filled!');
    } else {
      this.numMoves += 1;
      this.arrayElem[xVal][yVal] = 1;
      this.completeMove(yVal, xVal);
      let gameWon = this.checkGame(xVal, yVal);

      if(gameWon) {
        setTimeout(function() {alert(ticTacToeGame.turn + ' won!');}, 100);
        this.playing = false;
      } else if(this.numMoves === this.size*this.size){
        setTimeout(function() {alert('Game draw!');}, 100);
      } else {
        this.turn = this.turn === this.turnEnum.CIRCLE? this.turnEnum.CROSS : this.turnEnum.CIRCLE;
        this.chancesElem.html(this.turn);
      }
    }
  },
  checkGame: function (i, j) {
    let val = this.turnEnum.getValue(this.turn);
    this.rows[i]+=val;
    this.columns[j]+=val;
    if(i === j) {
      this.d1+=val;
    }
    if((i+j) === this.size-1) {
      this.d2+=val;
    }
    // console.log('R : '+this.rows);
    // console.log('C : ' + this.columns);
    // console.log('d1 : ' + this.d1);
    // console.log('d2 : ' + this.d2);

    if(Math.abs(this.rows[i]) === this.size || Math.abs(this.columns[j]) === this.size
  || Math.abs(this.d1) === this.size || Math.abs(this.d2) === this.size) {
      return true;
    }
  },
  checkGameLong: function() {

    //rows
    for(let i=0;i<this.size;i++) {
      let val = 0;
      for(let j=0;j<this.size;j++){
        val+=this.arrayElem[i][j];
        if(Math.abs(val) === 3) {
          return val;
        }
      }
    }

    //columns
    for(let i=0;i<this.size;i++) {
      let val = 0;
      for(let j=0;j<this.size;j++){
        val+=this.arrayElem[j][i];
        if(Math.abs(val) === 3) {
          return val;
        }
      }
    }

    //d1
    for(let i=0;i<this.size;i++) {
      let val = 0;
      for(let j=0;j<this.size;j++){
        if(i === j){
          val+=this.arrayElem[i][j];
        }
        if(Math.abs(val) === 3) {
          return val;
        }
      }
    }

    //d2
    for(let i=0;i<this.size;i++) {
      let val = 0;
      for(let j=0;j<this.size;j++){
        if(i + j === 2){
          val+=this.arrayElem[i][j];
        }
        if(Math.abs(val) === 3) {
          return val;
        }
      }
    }

  },
  movesLeft: function () {
    for(let i=0;i<this.size;i++) {
      for(let j=0;j<this.size;j++){
        if(this.arrayElem[i][j] === 0)
          return true;
      }
    }
    return false;
  },
  completeMove: function (xVal, yVal) {

    // let xVal = Math.floor((quad-1))%3;
    // let yVal = Math.floor((quad-1)/3);

    let threshold = 20;

    let p1 = new Point(this.grid['x'+(xVal + 1)]+threshold, this.grid['y'+(yVal+1)]+threshold);
    let p2 = new Point(this.grid['x'+(xVal + 1)]+threshold, this.grid['y'+(yVal+2)]-threshold);
    let p3 = new Point(this.grid['x'+(xVal + 2)]-threshold, this.grid['y'+(yVal+1)]+threshold);
    let p4 = new Point(this.grid['x'+(xVal + 2)]-threshold, this.grid['y'+(yVal+2)]-threshold);

    // console.log('x between ' + (xVal+1) + ' and ' + (xVal+2));
    // console.log('y between ' + (yVal+1) + ' and ' + (yVal+2));
    if(this.turn === this.turnEnum.CIRCLE) {
      this.canvas.drawCircle(p1, p2, p3, p4);
    } else {
      this.canvas.drawCross(p1, p2, p3, p4);
    }
  }
};

let Point = function(x, y) {
  this.x = x;
  this.y = y;
};
