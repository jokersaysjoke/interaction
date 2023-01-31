const express = require('express');
const app = express();

//socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//socket.io <end>

const path = require('path');
const jwtVerify = require(path.join(__dirname + '/router/jwt')).jwtVerify;

// app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', './views'); 
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
  res.render('index.ejs', {})
  });

// app.get('/live', (req, res) => {
//   const response=jwtVerify;
//   if(response!==null){
//     console.log(response);
//     res.render('live.ejs', {})
//   }else{
//     res.redirect("/")
//   }
// });
app.get('/live', (req, res) => {
  res.render('live.ejs',{})
})
app.get('/room', (req, res) => {
  res.render('chatroom.ejs',{})
})
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

// API
const userAPI=require('./router/API/user');
app.use('/api', userAPI);
const roomAPI=require('./router/API/room');
app.use('/api', roomAPI);

server.listen(4000, () => {
  console.log('listening on *:4000');
});