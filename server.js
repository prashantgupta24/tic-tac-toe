// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', (process.env.PORT || 5000));
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'static/index.html'));
});

// Starts the server.
server.listen((process.env.PORT || 5000), function() {
  console.log('Starting server on port 5000');
});

let roomNo = 1;
let roomSocketMapping = {};
let room = {};
let otherPlayer;

// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function(data) {
    //console.log('new player : ' + socket.id);
    if (room[roomNo] > 0) {
      socket.join(roomNo);
      roomSocketMapping[socket.id] = roomNo;
      startMatch(socket, roomNo, data.playerName, otherPlayer);
      roomNo++;
      //console.log(roomSocketMapping);
    } else {
      socket.join(roomNo);
      otherPlayer = data.playerName;
      socket.emit('message', 'Welcome ' + otherPlayer + '. Waiting for another player to join room ' + roomNo);
      roomSocketMapping[socket.id] = roomNo;
      room[roomNo] = 1;
      //console.log(roomSocketMapping);
      //console.log(room);
    }
  });
  socket.on('disconnect', function() {
    //console.log('disconnecting : ' + socket.id);
    socket.broadcast.to(roomSocketMapping[socket.id]).emit('message', 'Other player left, sorry');
    if (roomSocketMapping[socket.id]) {
      delete room[roomSocketMapping[socket.id]];
      delete roomSocketMapping[socket.id];
    }
    //console.log(room);
  });
  socket.on('move', function(data) {
    //console.log('played ' + data.xVal, data.yVal, socket.id);
    socket.broadcast.to(data.roomNo).emit('move', data);
    socket.emit('turn', false);
    socket.broadcast.to(data.roomNo).emit('turn', true);
  });
  socket.on('finished', function(data) {
    io.to(data.roomNo).emit('message', 'Match finished! Hit refresh to start a new game');
  });

  function startMatch(socket, roomNo, player1, player2) {
    io.to(roomNo).emit('room', {
      roomNo,
      player1,
      player2
    });
    if (Math.random() > 0.5) {
      socket.emit('turn', false);
      socket.broadcast.to(roomNo).emit('turn', true);
    } else {
      socket.emit('turn', true);
      socket.broadcast.to(roomNo).emit('turn', false);
    }
  }
});
