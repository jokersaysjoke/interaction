const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const { socket } = require('./router/socket');
const pool = require('./router/model')
const port=3000

const imgAPI = require('./router/api/image');
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
app.use('/api', imgAPI);
app.use('/api', userAPI);
app.use('/api', roomAPI);
app.use('/api', s3API);
app.use('/live', live);
app.use('/room', room);
// RESTful API <END>

app.get('/', async (req, res) => {
  try {
    let sql=`
    SELECT HOST
    FROM ROOM
    `
    const cookie = req.cookies['cookie'];
    const [record]=await pool.promise().query(sql, []);
    
    if (cookie&&record.length>0) {
      res.render('index.ejs', {});
    } else {
      res.redirect('/home');
    }
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({"error":true, "message":"Database error"});
  }
});

app.get('/home', async (req, res) => {
  res.render('home.ejs', {});
});

app.get('/description', async (req, res) => {
  res.render('desc.ejs', {});
});

app.get('/profile', async(req, res)=>{
  const cookie = req.cookies['cookie'];
  if(cookie){
    res.render('profile.ejs', {});
  }else{
    res.redirect('/home');
  }
});

socket(server);

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
