const express=require('express');
const pool=require('../models/model');
const roomAPI=express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const redis=require('../models/redis')
const { jwtVerify } = require('../models/jwt');
roomAPI.use(cookieParser());
roomAPI.use(bodyParser.json());

// preview all of live-room
roomAPI.get('/room', async (req, res)=>{
    try {
        let sql=`
        SELECT * 
        FROM ROOM
        WHERE STATUS = ?`;
        let [record]=await pool.promise().query(sql, "LIVE");
        
        if(record){
            let sql2=`
            SELECT ROOM.*, AVATAR.ADDRESS
            FROM ROOM
            LEFT JOIN AVATAR
            ON ROOM.EMAIL = AVATAR.EMAIL
            `
            let [result]=await pool.promise().query(sql2, [])
            return res.status(200).json({
                data:result
        })}else{
            return res.status(403).json({"data":null, "message":"No room"});
        }
    } catch (error) {
        console.error(err);
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

roomAPI.post('/room', async (req, res)=>{
    try {
        const body=req.body
        const name=body.name, email=body.email;

        let sql=`
        SELECT *
        FROM ROOM
        WHERE HOST = ?`;
        const [record] = await pool.promise().query(sql, [email]);
        if(record.length > 0){

            return res.status(403).json({"error":true, "message":"Room already exist"});
        }else{
            let sql=`
            INSERT INTO ROOM (HOST, EMAIL, STATUS, VIEWCOUNT)
            VALUES (?,?,?,?)`;
            await pool.promise().query(sql, [name, email, 'Upcoming', 0]);

            await redis.hsetCache(email, 0);

            return res.status(200).json({"ok":true});
        }
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

roomAPI.put('/room', async(req, res)=>{
    try {
        let sql=`
        UPDATE ROOM
        SET STATUS = ?, STREAMKEY = ?, HEAD = ?, DATE = ?
        WHERE HOST = ?
        `;
        const body=req.body;
        const status=body.status, host=body.host, streamkey=body.streamkey, head=body.head, date=body.date;

        await pool.promise().query(sql, [status, streamkey, head, date, host]);
        
        return res.status(200).json({"ok":true});
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

roomAPI.delete('/room', async(req, res)=>{
    try {
        let sql=`
        DELETE
        FROM ROOM
        WHERE HOST = ?
        `;
        const host=req.body['host'];
        await pool.promise().query(sql, host);
        await redis.cleanCache(host);
        
        return res.status(200).json({"ok":true});
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

roomAPI.get('/room/join', async (req, res)=>{
    try {
        const host=req.query.host;
        let sql=`
        SELECT ROOM.*, AVATAR.ADDRESS
        FROM ROOM
        LEFT JOIN AVATAR
        ON ROOM.EMAIL = AVATAR.EMAIL
        WHERE ROOM.HOST = ?
        `
        const [record]=await pool.promise().query(sql, [host]);
        return res.status(200).json({data:record})
        
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

roomAPI.put('/room/join', async(req, res)=>{
    try {
        const body=req.body;
        const host=body['host'];
        let sql=`
        SELECT VIEWCOUNT
        FROM ROOM
        WHERE HOST = ?
        `;
        const [record]=await pool.promise().query(sql, [host]);
        if(record){
            let sql2=`
            UPDATE ROOM
            SET VIEWCOUNT = ?
            WHERE HOST = ?
            `;
            const viewcount=await redis.updateCache(host);
            await pool.promise().query(sql2, [viewcount, host]);

            return res.status(200).json({"ok":true});
        }else{
          return res.status(403).json({"error":true, "message":"no record"});
        }
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

module.exports=roomAPI;