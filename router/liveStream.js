const express = require('express')
const pool = require('./model')
const live = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { jwtVerify, jwtSign } = require('./jwt');
live.use(cookieParser());
live.use(bodyParser.json());

live.get('/:ID', async(req, res) => {
  try {
    const {ID}=req.params
    let sql=`
    SELECT *
    FROM ROOM
    WHERE HOST = ?
    AND 
    (STATUS = ? OR STATUS = ?)
    `;
    const [record]=await pool.promise().query(sql, [ID, 'LIVE', 'Upcoming']);
    const [{HOST}]=record;

    if(record!==null){
      if(ID===HOST && HOST===ID){
        res.render('live.ejs', {});
      }else if(record.length<2 && ID===HOST){
        res.render('live.ejs', {});
      }else{
        res.redirect(`/`)        
      }
    }else{
      res.redirect(`/room/${ID}`);
    }
  } catch (error) {
      return res.status(500).json({"error":true, "message":"Database error"});
  }

});

module.exports=live;
