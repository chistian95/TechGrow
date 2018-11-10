var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
  console.log(`Nuevo usuario: ${socket.id}`);

  socket.on('disconnect', function() {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8082, function() {
  console.log(`Escuchando en ${server.address().port}`);
});
