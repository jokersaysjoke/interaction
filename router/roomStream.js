const express = require('express')
const pool = require('./model')
const room = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { jwtVerify, jwtSign } = require('./jwt');
room.use(cookieParser());
room.use(bodyParser.json());

room.get('/:ID', async(req, res)=>{
    try {
        const {ID}=req.params;
        let sql=`
        SELECT *
        FROM ROOM
        WHERE MASTER = ?
        `;
        const [record]=await pool.promise().query(sql, [ID]);
        if(record.name===ID){
            res.render('chatroom.ejs', {})
        }else{
            res.redirect(`/`)        
        }
        
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
        
    }    


})

module.exports=room;
