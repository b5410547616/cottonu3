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
var count = 0;

io.on('connection', function (socket) {
  socket.emit('news', { status: 'connected' });

  socket.on('requestUpdate', function() {
    socket.emit('update', { items, count });
  });

  socket.on('receiveData', function (data) {
  	console.log("receiveData", data);

    count = data.length;
    for (var i = data.length - 1 ; i >= 0 ; i--) {
      items.unshift(data[i]);
    }

    socket.broadcast.emit('clientData', {data, count});
  });

  socket.on('resetItem', function (data) {
    console.log("resetItem");
    items = [];
    count = 0;
    socket.broadcast.emit('resetClient');
  });

  socket.on('showBanner', function (num) {
      socket.broadcast.emit('showBannerClient', num)
  })

});


server.listen(8888, function(){
  console.log('listening on *:8888');
});