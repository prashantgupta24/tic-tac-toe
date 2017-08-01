// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

let waitingPlayer;
// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function() {
    console.log('new player : ' + socket.id);
    if (waitingPlayer) {
      //io.emit('message', 'match started!');
      startMatch(socket, waitingPlayer);
      waitingPlayer = '';

    } else {
      waitingPlayer = socket;
      socket.emit('message', 'Waiting for another player');
    }
  });
  // socket.on('disconnect', function() {
  //   console.log('disconnecting : ' + socket.id);
  //   if (waitingPlayer) {
  //     waitingPlayer = null;
  //   }
  // });
  socket.on('move', function (data) {
    console.log('played ' + data.xVal, data.yVal, socket.id);
    socket.broadcast.emit('move', data);
    socket.emit('turn', false);
    socket.broadcast.emit('turn', true);
  });
});

let players = [];

function startMatch(player1, player2) {
  players.push(player1);
  players.push(player2);

  // players.forEach(function(player) {
  //   player.emit('message', 'match started!');
  //   console.log(player.id);
  // });

  player1.emit('message', 'match started!');
  player1.broadcast.emit('message', 'match started!');

  player1.emit('turn', false);
  player1.broadcast.emit('turn', true);
}

// function onMove(data) {
//   console.log('played ' + data.xVal, data.yVal, socket.id);
// }
//
// setInterval(function() {
//   io.sockets.emit('message', 'hi!');
// }, 1000);
