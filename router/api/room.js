const express = require('express');
const pool = require('../models/model');
const roomAPI = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const redis = require('../models/redis')
const uuid = require('uuid');
const current = require('../models/currentTime')

roomAPI.use(cookieParser());
roomAPI.use(bodyParser.json());

// preview all of live-room
roomAPI.get('/room', async (req, res) => {
    try {
        let sql = `
        SELECT
            RECORDING.RECORDING_ID,
            RECORDING.TITLE,
            RECORDING.CREATED_AT,
            RECORDING.VISIBILITY,
            RECORDING.VIEWS,
            RECORDING.CONCURRENT,
            ROOM.STATUS,
            ROOM.ID,
            AVATAR.ADDRESS,
            MEMBER.NAME
        FROM RECORDING
        LEFT JOIN ROOM ON ROOM.RECORDING_ID = RECORDING.RECORDING_ID
        JOIN AVATAR ON AVATAR.USER_ID = RECORDING.USER_ID
        JOIN MEMBER ON MEMBER.USER_ID = RECORDING.USER_ID
        WHERE RECORDING.VISIBILITY = ? OR ROOM.STATUS = ?
        `;
    
        let [result] = await pool.promise().query(sql, ['public', 'LIVE']);
        return res.status(200).json({ 'data': result });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.post('/room', async (req, res) => {
    try {
        const name = req.body['name'], userId = req.body['userId'];
        let sql = `
        SELECT ROOM.USER_ID
        FROM ROOM
        WHERE USER_ID = ?
        `;
        const [record] = await pool.promise().query(sql, [userId]);
        if (record.length > 0) {

            return res.status(403).json({ "error": true, "message": "Room already exist" });
        } else {
            const roomId = uuid.v4();
            const recordingId = uuid.v4();
          
            let sql = `
            INSERT INTO RECORDING (ROOM_ID, RECORDING_ID, USER_ID)
            VALUES (?, ?, ?);
        `;
            let sql2 = `
                INSERT INTO ROOM (ID, USER_ID, RECORDING_ID)
                VALUES (?, ?, ?);
            `;

            await pool.promise().query(sql, [roomId, recordingId, userId]);
            await pool.promise().query(sql2, [roomId, userId, recordingId]);

            
            await redis.hsetCache(name, 0);
            return res.status(200).json({ "ok": true, 'roomId':roomId });
        }
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.put('/room/close', async (req, res) => {
    try {
        let sql = `
        UPDATE ROOM
        JOIN RECORDING
        ON ROOM.ID = RECORDING.ROOM_ID
        SET ROOM.STATUS = ?, RECORDING.VISIBILITY = ?
        WHERE ROOM.USER_ID = ?
        `;
        const body = req.body;
        const status = body.status, userId = body.userId;

        await pool.promise().query(sql, [status, 'public', userId]);

        return res.status(200).json({ "ok": true });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.put('/room/publish', async (req, res) => {
    try {
        const body = req.body;
        const status = body.status;
        const userId = body.userId;
        const title = body.title;
        const createdAt = current.getTaipeiTime();
        
        let sql = `
            UPDATE ROOM
            JOIN RECORDING ON ROOM.RECORDING_ID = RECORDING.RECORDING_ID
            SET ROOM.STATUS = ?,
                RECORDING.TITLE = ?,
                RECORDING.CREATED_AT = ?
            WHERE ROOM.USER_ID = ?
        `;
        
        await pool.promise().query(sql, [status, title, createdAt, userId]);

        return res.status(200).json({ "ok": true });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.delete('/room', async (req, res) => {
    try {
        const userId = req.body['userId'];
        const host = req.body['host'];
        
        let sql =`
        SELECT RECORDING.RECORDING_ID
        FROM RECORDING
        
        JOIN ROOM
        ON ROOM.ID = RECORDING.ROOM_ID
        
        WHERE RECORDING.USER_ID = ?
        `
        const [record] = await pool.promise().query(sql, [userId]);
        const [{ RECORDING_ID:recordingId }] = record
        let sql2 = `
        DELETE ROOM
        FROM ROOM
        JOIN RECORDING
        ON RECORDING.ROOM_ID = ROOM.ID
        WHERE ROOM.USER_ID = ?
        `;
        
        await pool.promise().query(sql2, [userId]);
        await redis.cleanCache(host);
        
        return res.status(200).json({ "ok": true, 'recordingId': recordingId });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.delete('/room/close', async (req, res) => {
    try {
        const userId = req.body['userId'];
        const host = req.body['host'];

        let sql = `
        DELETE ROOM, RECORDING
        FROM ROOM
        JOIN RECORDING
        ON RECORDING.ROOM_ID = ROOM.ID
        WHERE ROOM.USER_ID = ? OR RECORDING.VISIBILITY = ?
        `;
        
        await pool.promise().query(sql, [userId, 'Upcoming']);
        await redis.cleanCache(host);
        
        return res.status(200).json({ "ok": true});
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
})

roomAPI.get('/room/join', async (req, res) => {
    try {
        const host = req.query.host;
        let sql = `
        SELECT 
        RECORDING.TITLE,
        RECORDING.CREATED_AT,
        RECORDING.VIEWS,
        RECORDING.CONCURRENT,
        AVATAR.ADDRESS,
        MEMBER.NAME

        FROM ROOM
        
        JOIN 
        AVATAR
        ON 
        ROOM.USER_ID = AVATAR.USER_ID
        
        JOIN
        RECORDING
        ON
        ROOM.USER_ID = AVATAR.USER_ID

        JOIN
        MEMBER
        ON
        MEMBER.USER_ID = ROOM.USER_ID

        WHERE ROOM.ID = ?
        `
        const [record] = await pool.promise().query(sql, [host]);
        return res.status(200).json({ 'data': record })

    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.put('/room/join', async (req, res) => {
    try {
        const body = req.body;
        const host = body['host'];
        
        let sql = `
        UPDATE RECORDING
        JOIN ROOM
        ON RECORDING.USER_ID = ROOM.USER_ID
        SET VIEWS = ?
        WHERE RECORDING.ROOM_ID = ?
        `;

        const viewcount = await redis.updateCache(host);
        await pool.promise().query(sql, [viewcount, host]);

        return res.status(200).json({ "ok": true });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

module.exports = roomAPI;