var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');
 
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

const helmet = require('helmet');
const app = express();
app.use(helmet());

var items = [];

io.on('connection', function (socket) {
  socket.emit('news', { status: 'connected' });
  socket.emit('update', items);

  socket.on('receiveData', function (data) {
  	console.log("receiveData", data);

    for (var i = data.length - 1 ; i >= 0 ; i--) {
      items.unshift(data[i]);
    }

    socket.broadcast.emit('clientData', items);
  });

  socket.on('resetItem', function (data) {
    console.log("resetItem");
    items = [];
    socket.broadcast.emit('resetClient');
  });

});


server.listen(8888, function(){
  console.log('listening on *:8888');
});