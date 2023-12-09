const express = require('express');
const pool = require('../models/model');
const roomAPI = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const redis = require('../models/redis')

roomAPI.use(cookieParser());
roomAPI.use(bodyParser.json());

// preview all of live-room
roomAPI.get('/room', async (req, res) => {
    try {
        let sql = `
        SELECT * 
        FROM ROOM
        WHERE STATUS = ?`;
        let [record] = await pool.promise().query(sql, "LIVE");

        if (record) {
            let sql2 = `
            SELECT 
            ROOM.*,
            MEMBER.NAME,
            AVATAR.ADDRESS

            FROM ROOM

            LEFT JOIN 
            AVATAR
            ON
            ROOM.USER_ID = AVATAR.USER_ID

            JOIN
            MEMBER
            ON
            MEMBER.USER_ID = ROOM.USER_ID
            `
            let [result] = await pool.promise().query(sql2, [])
            return res.status(200).json({ 'data': result })
        }
        else {
            return res.status(403).json({ "data": null, "message": "No room" });
        }
    } catch (error) {
        console.error(err);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.post('/room', async (req, res) => {
    try {
        const name = req.body['name'], userid = req.body['userId'];
        let sql = `
        SELECT * 
        FROM ROOM
        WHERE USER_ID = ?`;
        const [record] = await pool.promise().query(sql, [userid]);
        if (record.length > 0) {

            return res.status(403).json({ "error": true, "message": "Room already exist" });
        } else {
            let sql = `
            INSERT INTO 
            ROOM (USER_ID)
            VALUES (?)`;
            await pool.promise().query(sql, [userid]);

            await redis.hsetCache(name, 0);

            return res.status(200).json({ "ok": true });
        }
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.put('/room', async (req, res) => {
    try {
        let sql = `
        UPDATE ROOM
        SET STATUS = ?, STREAMKEY = ?, HEAD = ?, DATE = ?
        WHERE USER_ID = ?
        `;
        const body = req.body;
        const status = body.status, userId = body.userId, streamkey = body.streamkey, head = body.head, date = body.date;

        await pool.promise().query(sql, [status, streamkey, head, date, userId]);

        return res.status(200).json({ "ok": true });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.delete('/room', async (req, res) => {
    try {
        let sql = `
        DELETE
        FROM ROOM
        WHERE USER_ID = ?
        `;
        const userId = req.body['userId'];
        const host = req.body['host']
        await pool.promise().query(sql, [userId]);
        await redis.cleanCache(host);

        return res.status(200).json({ "ok": true });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

roomAPI.get('/room/join', async (req, res) => {
    try {
        const host = req.query.host;
        let sql = `
        SELECT ROOM.*, AVATAR.ADDRESS
        FROM ROOM
        
        LEFT JOIN 
        AVATAR
        ON 
        ROOM.USER_ID = AVATAR.USER_ID

        JOIN
        MEMBER
        ON
        MEMBER.USER_ID = ROOM.USER_ID

        WHERE MEMBER.NAME = ?
        `
        const [record] = await pool.promise().query(sql, [host]);
        return res.status(200).json({ data: record })

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
        SELECT VIEWCOUNT
        FROM ROOM

        JOIN 
        MEMBER
        ON
        MEMBER.USER_ID = ROOM.USER_ID

        WHERE MEMBER.NAME = ?
        `;
        const [record] = await pool.promise().query(sql, [host]);
        if (record) {
            let sql2 = `
            UPDATE ROOM
            
            JOIN
            MEMBER
            ON
            MEMBER.USER_ID = ROOM.USER_ID

            SET VIEWCOUNT = ?
            WHERE MEMBER.NAME = ?
            `;
            const viewcount = await redis.updateCache(host);
            await pool.promise().query(sql2, [viewcount, host]);

            return res.status(200).json({ "ok": true });
        } else {
            return res.status(403).json({ "error": true, "message": "no record" });
        }
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

module.exports = roomAPI;