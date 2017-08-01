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

var players = [];
// Add the WebSocket handlers
io.on('connection', function(socket) {
  socket.on('new player', function() {
    if(players.length > 0) {
      io.emit('message', 'match started!');
    } else {
      players[socket.id] = socket;
      socket.emit('message', 'Waiting for another player' + socket.id);
    }
    // players[socket.id] = {
    //   x: 300,
    //   y: 300
    // };

  });
});
//
// setInterval(function() {
//   io.sockets.emit('message', 'hi!');
// }, 1000);
