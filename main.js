$(function () {
  //console.log('ready');
  let ticTacToeGame = ticTacToe;
  ticTacToeGame.chancesElem = $('#chances');

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
    getWidthOfCanvas: function () {
      return this.canvasElement.width;
    },
    clearCanvas: function () {
      this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      //console.log('canvas cleared');
    }
  };

  ticTacToeGame.initialize();

  $(document).keypress(function (event) {
    if(ticTacToeGame.playing) {
      let keyCode = event.which || event.keyCode;
      //console.log(keyCode);
      if(keyCode >= 49 && keyCode <= 57) {
        ticTacToeGame.findQuadrant(String.fromCharCode(keyCode));
      }
    }
  });
});

let ticTacToe = {
  playing: false,
  turn: 'cross',
  grid: {
    x1:50,
    x2:180,
    x3:350,
    x4:520,
    y1:100,
    y2:230,
    y3:390,
    y4:500
  },
  initialize: function (){
    //console.log('starting game');
    this.canvas.initializeCanvas();
    this.playing = true;
    this.chancesElem.html(this.turn);
  },
  findQuadrant: function (quad) {

    let xVal = Math.floor((quad-1))%3;
    let yVal = Math.floor((quad-1)/3);

    let threshold = 20;

    let p1 = new Point(this.grid['x'+(xVal + 1)]+threshold, this.grid['y'+(yVal+1)]+threshold);
    let p2 = new Point(this.grid['x'+(xVal + 1)]+threshold, this.grid['y'+(yVal+2)]-threshold);
    let p3 = new Point(this.grid['x'+(xVal + 2)]-threshold, this.grid['y'+(yVal+1)]+threshold);
    let p4 = new Point(this.grid['x'+(xVal + 2)]-threshold, this.grid['y'+(yVal+2)]-threshold);

    // console.log('x between ' + (xVal+1) + ' and ' + (xVal+2));
    // console.log('y between ' + (yVal+1) + ' and ' + (yVal+2));
    if(this.turn === 'circle') {
      this.canvas.drawCircle(p1, p2, p3, p4);
      this.turn = 'square';
      this.chancesElem.html(this.turn);
    } else {
      this.canvas.drawCross(p1, p2, p3, p4);
      this.turn = 'circle';
      this.chancesElem.html(this.turn);
    }
  }
};

let Point = function(x, y) {
  this.x = x;
  this.y = y;
};
