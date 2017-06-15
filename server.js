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
var banner1 = false;
var banner2 = false;

io.on('connection', function (socket) {
  socket.emit('news', { status: 'connected' });
  socket.emit('updateBanner', banner1, banner2);
  // socket.emit('update', items, count );

  socket.on('requestUpdate', function() {
    socket.emit('update', { items, count });
  });


  socket.on('receiveData', function (data) {
  	console.log("receiveData", data);

    count = data.length;
    for (var i = data.length - 1 ; i >= 0 ; i--) {
      items.unshift(data[i]);
    }

    socket.broadcast.emit('clientData', data, count);
  });

  socket.on('resetItem', function (data) {
    console.log("resetItem");
    items = [];
    count = 0;
    socket.broadcast.emit('resetClient');
  });

  socket.on('showBanner', function (num) {
      if(num === 1) banner1 = !banner1;
      else if(num === 2) banner2 = !banner2;
      console.log(banner1, banner2);
      socket.broadcast.emit('showBannerClient', num)
  })

  socket.on('disconnect', function() {
    socket.emit("resetAllItem");
  })
});

server.listen(8888, function(){
  console.log('listening on *:8888');
});