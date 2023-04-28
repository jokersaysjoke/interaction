const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const { socket } = require('./router/socket');
const userAPI = require('./router/api/user');
const roomAPI = require('./router/api/room');
const s3API = require('./router/api/s3');
const live = require('./router/liveStream');
const room = require('./router/roomStream');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));
app.use(cookieParser());

// RESTful API
app.use('/api', userAPI);
app.use('/api', roomAPI);
app.use('/api', s3API);
app.use('/live', live);
app.use('/room', room);
// RESTful API <END>

app.get('/', async (req, res) => {
  const cookie = req.cookies['cookie'];
  if (cookie) {
    res.render('index.ejs', {});
  } else {
    res.redirect('/home');
  }
});

app.get('/home', async (req, res) => {
  res.render('home.ejs', {});
});

app.get('/description', async (req, res) => {
  res.render('desc.ejs', {});
});

socket(server);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
