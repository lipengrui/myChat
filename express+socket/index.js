var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function  (req, res){
    res.sendFile(__dirname+ '/index.html')
})
io.on('connection', function (socket){
console.log('a user connected');
socket.join('room 237', () => {
    let rooms = Object.keys(socket.rooms);
    console.log(rooms); // [ <socket.id>, 'room 237' ]
    io.to('room 237', 'a new user has joined the room'); // broadcast to everyone in the room
  });
    socket.on('disconnect', function (){
        // console.log('user disconnected')
    })
    socket.on('chat message', function (msg){
        // socket.emit('chat message', msg);
        socket.broadcast.emit('chat message', msg)
    })
    
});
http.listen(3000, function () {
    console.log('listening on *:3000');
})