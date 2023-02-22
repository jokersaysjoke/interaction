const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const pool=require('./router/model');
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
  socket.on('join-room', async roomID => {
    let sql=`
    UPDATE ROOM
    SET CONCURRENT = ?
    WHERE MASTER = ?
    `;

    socket.join(roomID)
    io.to(roomID).emit('roomCount', io.sockets.adapter.rooms.get(roomID).size);
    const count=io.sockets.adapter.rooms.get(roomID).size;
    await pool.promise().query(sql, [count, roomID]);
    
    socket.on('disconnecting',async ()=>{
      io.to(roomID).emit('roomCount', io.sockets.adapter.rooms.get(roomID).size -1);
      const discount=io.sockets.adapter.rooms.get(roomID).size -1;
      await pool.promise().query(sql, [discount, roomID]);

    });

    // io.to(roomID).emit('viewCount', io.sockets.adapter.rooms.get(roomID).size);
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