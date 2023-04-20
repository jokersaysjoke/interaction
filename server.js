// 導入 express
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static('./public'));

const cookieParser = require('cookie-parser');
const pool=require('./router/model');
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views'); 

app.get('/', (req, res) => {
  const cookie=req.cookies['cookie'];
  if(cookie){
    res.render('index.ejs', {});
  }else{
    res.redirect('/home');
  }
});
app.get('/home', (req, res)=>{
  res.render('home.ejs', {})
})
app.get('/description', (req, res)=>{
  res.render('desc.ejs', {})
})

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
    const count=io.sockets.adapter.rooms.get(roomID).size;
    io.to(roomID).emit('roomCount', count);
    await pool.promise().query(sql, [count, roomID]);

    socket.on('disconnecting', async ()=>{
      const discount=count-1;
      io.to(roomID).emit('roomCount', discount);
      await pool.promise().query(sql, [discount, roomID]);
    });
    
    let sql2=`
    SELECT VIEWCOUNT
    FROM ROOM
    WHERE MASTER = ?
    `;
    const [record]=await pool.promise().query(sql2, [roomID]);
    const [{VIEWCOUNT:viewCount}]=record;
    io.to(roomID).emit('viewCount', viewCount);

  });

});
// socket.io <END>

// API
const userAPI=require('./router/api/user');
app.use('/api', userAPI);
const roomAPI=require('./router/api/room');
app.use('/api', roomAPI);
const s3API=require('./router/api/s3');
app.use('/api', s3API);
const live=require('./router/liveStream');
app.use('/live', live);
const room=require('./router/roomStream');
app.use('/room', room);
// API <END>





server.listen(3000, () => {
  console.log('listening on *:3000');
});