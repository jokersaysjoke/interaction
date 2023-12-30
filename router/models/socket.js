const { Server } = require('socket.io');
const redis = require('./redis.js');
const pool = require('./model.js');

function socket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('chat message', async (msg, roomID) => {
      const username = msg.username, message = msg.message, img = msg.img, time = msg.time;
      let sql = `
        INSERT INTO MESSAGE (CHATROOM_ID, IMAGE_URL, CREATED_AT, USER_ID, CONTENT)
        VALUES (?,?,?,?,?)
        `;
      await pool.promise().query(sql, [roomID, img, time, username, message]);

      if (roomID === '') {
        console.log(`no roomID`);
      } else {
        socket.to(roomID).emit('receive-message', { username: username, message: message, img: img, time: time });
      }
    });

    socket.on('join-room', async roomID => {
      socket.join(roomID)
      await redis.updateConcurrent(roomID, 1);
      const concurrent = await redis.hgetCache(roomID, 'concurrent');
      io.to(roomID).emit('roomCount', concurrent);
      
      socket.on('leaveRoom', async () => {
        await redis.updateConcurrent(roomID, -1);
        const discount = await redis.hgetCache(roomID, 'concurrent');
        io.to(roomID).emit('roomCount', discount);
        
      });

      const viewCount = await redis.hgetCache(roomID, 'totalViews')
      io.to(roomID).emit('viewCount', viewCount);
    })

  })
}

module.exports = { socket };