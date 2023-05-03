const {Server}=require('socket.io');
const redis=require('./redis.js');
const pool=require('./model');

function socket(server){
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
        const viewCount=await redis.hgetCache(roomID, 'totalViews')
        io.to(roomID).emit('viewCount', viewCount);
      })
    
    })
}

module.exports={socket};