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

let roomNo = 1;
let waitingPlayer;
let roomSocketMapping = {};

// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function() {
    //console.log('new player : ' + socket.id);
    if (waitingPlayer) {
      //io.emit('message', 'match started!');
      socket.join(roomNo);
      roomSocketMapping[waitingPlayer.id] = roomNo;
      roomSocketMapping[socket.id] = roomNo;
      startMatch(socket, roomNo);
      roomNo++;
      waitingPlayer = '';
      console.log(roomSocketMapping);

    } else {
      waitingPlayer = socket;
      socket.join(roomNo);
      socket.emit('message', 'Waiting for another player to join room ' + roomNo);
      console.log(roomSocketMapping);
    }
  });
  socket.on('disconnect', function() {
    console.log('disconnecting : ' + socket.id);
    if (waitingPlayer) {
      waitingPlayer = null;
    }
    socket.broadcast.to(roomSocketMapping[socket.id]).emit('message', 'Other player left, sorry');
  });
  socket.on('move', function(data) {
    //console.log('played ' + data.xVal, data.yVal, socket.id);
    socket.broadcast.to(data.roomNo).emit('move', data);
    socket.emit('turn', false);
    socket.broadcast.to(data.roomNo).emit('turn', true);
  });

  function startMatch(socket, roomNo) {

    io.to(roomNo).emit('room', roomNo);
    //io.to(roomNo).emit('message', 'match started!');
    if(Math.random()>0.5) {
      socket.emit('turn', false);
      socket.broadcast.to(roomNo).emit('turn', true);
    } else {
      socket.emit('turn', true);
      socket.broadcast.to(roomNo).emit('turn', false);
    }


  }

});



// function onMove(data) {
//   console.log('played ' + data.xVal, data.yVal, socket.id);
// }
//
// setInterval(function() {
//   io.sockets.emit('message', 'hi!');
// }, 1000);
