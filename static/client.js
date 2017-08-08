$(function() {
  //console.log('ready');

  let ticTacToeGame = ticTacToe(3); //main value, sets size of the game board (size * size)
  const SOCKET_OBJ = initializeSocket();
  initializePage();


  function initializePage() {
    if ($.cookie('username')) {
      console.log('Welcome back ' + $.cookie('username'));
      $('#initialDiv').hide();
      startGame();
    } else {
      $('#player_name').focus();
      $(document).on('keypress', function(event) {
        if (event.keyCode === 13) {
          setupGame();
        }
      });

      $('#start_game').on('click', function() {
        setupGame();
      });
    }
  }

  function setupGame() {
    const PLAYER_NAME = $('#player_name').val();
    if (PLAYER_NAME.length < 3 ||
      PLAYER_NAME.indexOf('prashant') > -1) {
      $('#error').html('Please enter a decent name');
    } else {
      $.cookie('username', PLAYER_NAME);
      $('#initialDiv').hide();
      $(document).unbind('keypress');
      startGame();
    }
  }

  function startGame() {
    SOCKET_OBJ.socket.emit('new player', {
      playerName: $.cookie('username')
    });
    ticTacToeGame.initialize();
  }

  function initializeSocket() {
    let socket = io();

    socket.on('message', function(data) {
      ticTacToeGame.setPlayingElem(data);
    });

    socket.on('room', function(data) {
      console.log('Joined room ' + data.roomNo + ' : ' + $.cookie('username'));
      SOCKET_OBJ.roomNo = data.roomNo;
      if ($.cookie('username') === data.player1) {
        ticTacToeGame.otherPlayer = data.player2;
      } else {
        ticTacToeGame.otherPlayer = data.player1;
      }
      //console.log('playing with ' + ticTacToeGame.otherPlayer);
    });

    socket.on('turn', function(data) {
      //console.log('turn ' + data);
      ticTacToeGame.setPlaying(data);
      if (data) {
        ticTacToeGame.setPlayingElem('YOUR TURN, You are playing with ' + ticTacToeGame.otherPlayer);
      } else {
        if (ticTacToeGame.otherPlayer[ticTacToeGame.otherPlayer.length - 1] === 's') {
          ticTacToeGame.setPlayingElem(ticTacToeGame.otherPlayer + '\' turn');
        } else {
          ticTacToeGame.setPlayingElem(ticTacToeGame.otherPlayer + '\'s turn');
        }
      }
    });

    socket.on('move', function(data) {
      //console.log('They moved : ' + data.xVal, data.yVal);
      ticTacToeGame.playMove(data.xVal, data.yVal);
    });

    return {
      socket
    };
  }


  function ticTacToe(size) {

    let turn = '';
    let grid = {};
    let canvas = {};
    let arrayElem = [];
    let chancesElem = $('#chances');
    let playingElem = $('#playing');
    let playing = false;
    let rows = [];
    let columns = [];
    let d1 = 0;
    let d2 = 0;
    let numMoves = 0;

    function setPlaying(isPlaying) {
      playing = isPlaying;
    }

    function getTurn() {
      return turn;
    }

    function setTurn(setTurn) {
      turn = setTurn;
    }

    function setPlayingElem(data) {
      playingElem.html(data);
    }

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

    function initialize() {

      canvas = createCanvas(grid);
      canvas.initializeCanvas(size);
      initializeMouseMove();
      //console.log(grid);
      arrayElem = arrayMatrix(size, size, 0);
      setTurn(turnEnum.CIRCLE);
      numMoves = 0;
      chancesElem.html('Chance: ' + getTurn());

      initializeArrays();
    }

    function initializeMouseMove() {
      let canvasElement = document.getElementById('wordCanvas');
      let rect = canvasElement.getBoundingClientRect();

      $('#wordCanvas').on('click', function(event) {
        let x = event.pageX - rect.left;
        let y = event.pageY - rect.top;
        //console.log(x + ', ' + y);
        handleMouseClick(x, y);
      });
    }

    function handleMouseClick(x, y) {
      let xVal = 0;
      let yVal = 0;
      for (let i = 1; i <= size; i++) {
        if (x >= grid['x' + (i)] && x < grid['x' + (i + 1)]) {
          xVal = i;
          break;
        }
      }

      for (let i = 1; i <= size; i++) {
        if (y >= grid['y' + (i)] && y < grid['y' + (i + 1)]) {
          yVal = i;
          break;
        }
      }
      if (xVal >= 1 && yVal >= 1 && playing) {
        //console.log(yVal-1, xVal-1);
        let validMove = playMove(yVal - 1, xVal - 1);
        if (validMove) {
          const roomNo = SOCKET_OBJ.roomNo;
          SOCKET_OBJ.socket.emit('move', {
            roomNo,
            xVal: yVal - 1,
            yVal: xVal - 1
          });
        }
      }
    }

    function initializeArrays() {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          arrayElem[i][j] = 0;
          rows[j] = 0;
          columns[j] = 0;
        }
      }
    }

    function playMove(xVal, yVal) {

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
            playingElem.html('Match finished! Hit refresh to start a new game');
          }, 100);
          setPlaying(false);
        } else if (numMoves === size * size) {
          setTimeout(function() {
            alert('Game draw!');
          }, 100);
          setPlaying(false);
        } else {
          setTurn(getTurn() === turnEnum.CIRCLE ? turnEnum.CROSS : turnEnum.CIRCLE);
          chancesElem.html('Chance: ' + getTurn());
        }
        return true;
      }
    }

    function checkGame(i, j) {
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
    }

    function drawObject(xVal, yVal) {

      let threshold = 20;

      let p1 = new point(grid['x' + (xVal + 1)] + threshold, grid['y' + (yVal + 1)] + threshold);
      let p2 = new point(grid['x' + (xVal + 1)] + threshold, grid['y' + (yVal + 2)] - threshold);
      let p3 = new point(grid['x' + (xVal + 2)] - threshold, grid['y' + (yVal + 1)] + threshold);
      let p4 = new point(grid['x' + (xVal + 2)] - threshold, grid['y' + (yVal + 2)] - threshold);

      // console.log('x between ' + (xVal+1) + ' and ' + (xVal+2));
      // console.log('y between ' + (yVal+1) + ' and ' + (yVal+2));
      if (getTurn() === turnEnum.CIRCLE) {
        canvas.drawCircle(p1, p2, p3, p4);
      } else {
        canvas.drawCross(p1, p2, p3, p4);
      }
    }

    return {
      setPlaying,
      initialize,
      playMove,
      setPlayingElem
    };
  }

  function createCanvas(gameGrid) {

    let canvasElement = document.getElementById('wordCanvas');
    let ctx = document.getElementById('wordCanvas').getContext('2d');

    function initializeCanvas(numRows) {
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
        let p1 = new point(gameGrid.x1, gameGrid['y' + (i)]);
        let p2 = new point(gameGrid['x' + (numRows + 1)], gameGrid['y' + (i)]);
        drawPoints(p1, p2);
      }

      //vertical lines
      for (let i = 2; i <= numRows; i++) {
        let p1 = new point(gameGrid['x' + (i)], gameGrid.y1);
        let p2 = new point(gameGrid['x' + (i)], gameGrid['y' + (numRows + 1)]);
        drawPoints(p1, p2);
      }
    }

    function drawPoints(p1, p2) {
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    function drawCross(p1, p2, p3, p4) {
      drawPoints(p1, p4);
      drawPoints(p2, p3);
    }

    function drawCircle(p1, p2, p3, p4) {
      let centreX = (p1.x + p4.x) / 2;
      let centreY = (p1.y + p4.y) / 2;
      let radius = (p4.x - p1.x) < (p4.y - p1.y) ? (p4.x - p1.x) / 2 : (p4.y - p1.y) / 2;

      ctx.beginPath();
      ctx.arc(centreX, centreY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      //console.log('canvas cleared');
    }

    return {
      initializeCanvas,
      drawCross,
      drawCircle,
      clearCanvas
    };
  }

  function arrayMatrix(numRows, numCols, initial) {
    var arr = [];
    for (var i = 0; i < numRows; ++i) {
      var columns = [];
      for (var j = 0; j < numCols; ++j) {
        columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
  }

  function point(x, y) {
    this.x = x;
    this.y = y;
  }

});
