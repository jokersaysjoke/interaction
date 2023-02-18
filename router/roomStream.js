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
        AND STATUS = ?
        `;
        const cookie=req.cookies['cookie'];
        const response=jwtVerify(cookie);
        const name=response['name'];
        const [record]=await pool.promise().query(sql, [ID, 'LIVE']);
        if(record!==null){
            const [{ MASTER }]=record
            if(MASTER===name){
                res.redirect(`/live/${ID}`)   
            }else if(cookie){
                res.render('chatroom.ejs', {})
            }else{
                res.redirect(`/`)   
            }
        }else{
            res.redirect(`/`)   
        }
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
        
    }    
});

room.get('/', async(req, res)=>{
    res.redirect(`/`)   

});
module.exports=room;
