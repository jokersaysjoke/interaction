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
    try {
        let sql=`
        SELECT * 
        FROM ROOM
        WHERE STATUS = ?`;
        [record]=await pool.promise().query(sql, "LIVE");
        if(record){
            return res.status(200).json({
                data:record
        })}else{
            return res.status(403).json({"data":null, "message":"No room"});
        }
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

// master create room
roomAPI.post('/room', async (req, res)=>{
    try {
        const cookie=req.cookies['cookie'];
        const response=jwtVerify(cookie);
        const name=response['name'];
        const email=response['email'];
        let sql=`
        SELECT *
        FROM ROOM
        WHERE MASTER = ?`;
        const [record] = await pool.promise().query(sql, [email]);
        if(record.length > 0){
          return res.status(403).json({"error":true, "message":"Room already exist"});
        }else{
            let sql=`
            INSERT INTO ROOM (MASTER, EMAIL, STATUS, VIEWCOUNT)
            VALUES (?,?,?,?)`;
            await pool.promise().query(sql, [name, email, 'Upcoming', 0]);
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
        WHERE MASTER = ?
        `;
        const body=req.body;
        const status=body['status'];
        const master=body['master'];
        const streamkey=body['streamkey'];
        const head=body['head'];
        const date=body['date'];
        await pool.promise().query(sql, [status, streamkey, head, date, master]);
        return res.status(200).json({"ok":true});
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

// master close room
roomAPI.delete('/room', async(req, res)=>{
    try {
        let sql=`
        DELETE
        FROM ROOM
        WHERE MASTER = ?
        `;
        const master=req.body['master'];
        await pool.promise().query(sql, master);
        return res.status(200).json({"ok":true});
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

roomAPI.get('/room/join', async (req, res)=>{
    try {
        const host=req.query.host;
        let sql=`
        SELECT * 
        FROM ROOM
        WHERE MASTER = ?
        `;
        const [record]=await pool.promise().query(sql, [host]);
        res.status(200).json({data:record})
        
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
        WHERE MASTER = ?
        `;
        const [record]=await pool.promise().query(sql, [host]);
        if(record){
            let sql2=`
            UPDATE ROOM
            SET VIEWCOUNT = VIEWCOUNT + ?
            WHERE MASTER = ?
            `;
            await pool.promise().query(sql2, [1, host]);
            return res.status(200).json({"ok":true});
        }else{
          return res.status(403).json({"error":true, "message":"no record"});
        }
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});

module.exports=roomAPI;