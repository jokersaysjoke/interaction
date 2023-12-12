const express = require('express')
const pool = require('./model')
const live = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { jwtVerify } = require('../models/jwt');

live.use(cookieParser());
live.use(bodyParser.json());

live.get('/:roomId', async(req, res) => {
  try {
    const {roomId}=req.params
    let sql=`
    SELECT ROOM.ID, ROOM.USER_ID
    FROM ROOM

    JOIN
    MEMBER
    ON
    MEMBER.USER_ID = ROOM.USER_ID

    WHERE ROOM.ID = ?
    AND 
    (STATUS = ? OR STATUS = ?)
    `;
    const [record]=await pool.promise().query(sql, [roomId, 'LIVE', 'Upcoming']);
    const [{ID}]=record;
    const [{USER_ID:userId}]=record;

    const cookie = req.cookies['cookie'];
    const response = jwtVerify(cookie);
    const target = response.userId
    

    if(record !== null){
      if( userId === target){
        res.render('live.ejs', {});
      }else{
        res.redirect(`/`)
      }
    }else{
      res.redirect(`/`)
    }
  } catch (error) {
      console.error('error:', error);
      return res.status(500).json({"error":true, "message":error});
  }

});

module.exports=live;
