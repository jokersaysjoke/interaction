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
    // const cookie=req.cookies['cookie'];
    // const response=jwtVerify(cookie);
    // const name=response['name'];
    // console.log(name);

    let sql=`
    SELECT *
    FROM ROOM
    WHERE MASTER = ?
    AND 
    (STATUS = ? OR STATUS = ?)
    `;
    const [record]=await pool.promise().query(sql, [ID, 'LIVE', 'Upcoming']);
    const [{MASTER}]=record;

    if(record!==null){
      if(ID===MASTER && MASTER===ID){
        res.render('live.ejs', {});
      }else if(record.length<2 && ID===MASTER){
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
