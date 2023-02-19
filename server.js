const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());


const path = require('path');
const {jwtVerify} = require(path.join(__dirname + '/router/jwt'));

// app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', './views'); 
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
  res.render('index.ejs', {})
});

const cookie = require("cookie");
// socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('chat message', (msg, roomID) => {
    const username=msg.username;
    const message=msg.message;

    if(roomID===''){
      console.log(`no roomID`);
    }else{
      socket.to(roomID).emit('receive-message', {username:username, message:message});
    }
  });
  socket.on('join-room', roomID => {
    socket.join(roomID)
  });
});
// socket.io <END>

// API
const userAPI=require('./router/api/user');
app.use('/api', userAPI);
const roomAPI=require('./router/api/room');
app.use('/api', roomAPI);
const live=require('./router/liveStream');
app.use('/live', live);
const room=require('./router/roomStream');
app.use('/room', room);

server.listen(3000, () => {
  console.log('listening on *:3000');
});