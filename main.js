$(function () {
  //console.log('ready');
  let ticTacToeGame = ticTacToe;

  ticTacToeGame.canvas = {
    canvasElement: document.getElementById('wordCanvas'),
    ctx: document.getElementById('wordCanvas').getContext('2d'),
    initializeCanvas: function() {
      //vertical lines
      let p1 = new Point(ticTacToeGame.grid.x2, ticTacToeGame.grid.y1);
      let p2 = new Point(ticTacToeGame.grid.x2, ticTacToeGame.grid.y4);
      this.drawPoints(p1, p2);

      this.draw(ticTacToeGame.grid.x3,ticTacToeGame.grid.y1,ticTacToeGame.grid.x3,ticTacToeGame.grid.y4);

      //horizontal lines
      this.draw(ticTacToeGame.grid.x1,ticTacToeGame.grid.y2,ticTacToeGame.grid.x4,ticTacToeGame.grid.y2);
      this.draw(ticTacToeGame.grid.x1,ticTacToeGame.grid.y3,ticTacToeGame.grid.x4,ticTacToeGame.grid.y3);
    },
    draw: function(x1, y1, x2, y2) {
      this.ctx.moveTo(x1,y1);
      this.ctx.lineTo(x2,y2);
      this.ctx.stroke();
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
  //ticTacToeGame.turn = ticTacToeGame.turnEnum.CROSS;
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

let ticTacToe = {
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
  rows: new Array(3),
  columns: new Array(3),
  d1: 0,
  d2: 0,
  numMoves: 0,
  arrayElem: Array.matrix(3,3,0),
  grid: {
    x1:50,
    x2:180,
    x3:350,
    x4:520,
    y1:80,
    y2:210,
    y3:370,
    y4:480
  },
  initialize: function (){
    this.canvas.initializeCanvas();
    this.playing = true;
    this.turn = this.turnEnum.CROSS;
    this.numMoves = 0;
    this.chancesElem.html(this.turn);
    this.initializeArrays();
  },
  initializeArrays: function () {
    for(let i=0;i<3;i++) {
      for(let j=0;j<3;j++){
        this.arrayElem[i][j]=0;
        this.rows[j] = 0;
        this.columns[j] = 0;
      }
    }
  },
  playMove: function (quad) {

    let xVal = Math.floor((quad-1)/3);
    let yVal = Math.floor((quad-1))%3;

    if(this.arrayElem[xVal][yVal] != 0) {
      alert('That spot is filled!');
    } else {
      this.numMoves += 1;
      this.arrayElem[xVal][yVal] = 1;
      this.completeMove(quad, yVal, xVal);
      let gameWon = this.checkGame(xVal, yVal);

      if(gameWon) {
        setTimeout(function() {alert(ticTacToe.turn + ' won!');}, 100);
        this.playing = false;
      } else if(this.numMoves === 9){
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
    if((i+j) === 2) {
      this.d2+=val;
    }
    // console.log('R : '+this.rows);
    // console.log('C : ' + this.columns);
    // console.log('d1 : ' + this.d1);
    // console.log('d2 : ' + this.d2);

    if(Math.abs(this.rows[i]) === 3 || Math.abs(this.columns[j]) === 3
  || Math.abs(this.d1) === 3 || Math.abs(this.d2) === 3) {
      return true;
    }
  },
  completeMove: function (quad, xVal, yVal) {

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
