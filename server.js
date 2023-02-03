const express = require('express');
const app = express();

//socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
//socket.io <end>

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

app.get('/live', (req, res) => {
  res.render('live.ejs',{})
})
app.get('/room', (req, res) => {
  res.render('chatroom.ejs',{})
})
app.get('/flv', (req, res) => {
  res.render('flv.ejs', {})
})
// socket.io
io.on('connection', (socket) => {
  const cookies = socket.request.headers.cookie;
  const result=jwtVerify(cookies)
  const username=result.name
  socket.on('chat message', (msg) => {
    io.emit('chat message', {username:username, message:msg});
  });
});
// socket.io <END>

// API
const userAPI=require('./router/API/user');
app.use('/api', userAPI);
const roomAPI=require('./router/API/room');
app.use('/api', roomAPI);

server.listen(4000, () => {
  console.log('listening on *:4000');
});