const express=require('express');
const pool=require('../model');
const roomAPI=express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { jwtVerify, jwtSign } = require('../jwt');
roomAPI.use(cookieParser());
roomAPI.use(bodyParser.json());

// preview all of live-room
roomAPI.get('/room', async (req, res)=>{
    let sql=`
    SELECT * 
    FROM ROOM`
    try {
        [record]=await pool.promise().query(sql);
        console.log(record);
        return res.json({
            data:record
        })
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

// master create room
roomAPI.post('/room', async (req, res)=>{
    const cookie=req.headers.cookie;
    const response=jwtVerify(cookie);
    const name=response['name'];
    const email=response['email'];

    let sql=`
    SELECT *
    FROM ROOM
    WHERE MASTER = ?`;
    try {
        const [record] = await pool.promise().query(sql, [email]);
        if(record.length > 0){
          return res.status(400).json({"error":true, "message":"Room already exist"});
        }else{
            let sql=`
            INSERT INTO ROOM (MASTER, EMAIL, STATUS) 
            VALUES (?,?,?)`;
            await pool.promise().query(sql, [name, email, 'LIVE']);
            return res.status(200).json({"ok":true});
        }
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

roomAPI.put('/room', (req, res)=>{
    const user=req.body.user;
    // return res.redirect('/room');
});

// master close room
roomAPI.delete('/room', async (req, res)=>{
    let sql=`
    DELETE
    FROM ROOM
    WHERE MASTER = ?
    `;
    const master=req.body.master;
    try {
        await pool.promise().query(sql, [master]);
        return res.status(200).json({"ok":true});
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

module.exports=roomAPI;