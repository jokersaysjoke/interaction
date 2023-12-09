const express = require('express')
const pool = require('./model')
const live = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

live.use(cookieParser());
live.use(bodyParser.json());

live.get('/:ID', async(req, res) => {
  try {
    const {ID}=req.params
    let sql=`
    SELECT 
    MEMBER.NAME
    
    FROM ROOM

    JOIN
    MEMBER
    ON
    MEMBER.USER_ID = ROOM.USER_ID

    WHERE MEMBER.NAME = ?
    AND 
    (STATUS = ? OR STATUS = ?)
    `;
    const [record]=await pool.promise().query(sql, [ID, 'LIVE', 'Upcoming']);
    const [{NAME}]=record;

    if(record!==null){
      if(ID===NAME && NAME===ID){
        res.render('live.ejs', {});
      }else if(record.length<2 && ID===NAME){
        res.render('live.ejs', {});
      }else{
        res.redirect(`/`)        
      }
    }else{
      res.redirect(`/room/${ID}`);
    }
  } catch (error) {
      console.error('error:', error);
      return res.status(500).json({"error":true, "message":error});
  }

});

module.exports=live;
