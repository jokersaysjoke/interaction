const express = require('express');
const pool = require('../models/model');
const watchAPI = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

watchAPI.use(cookieParser());
watchAPI.use(bodyParser.json());

watchAPI.get('/watch', async (req, res) => {
    try {
        const recordingId = req.query.v
        let sql = `
        SELECT 
            RECORDING.TITLE,
            RECORDING.CREATED_AT,
            RECORDING.VIEWS,
            MEMBER.NAME,
            AVATAR.ADDRESS
        FROM RECORDING
        JOIN MEMBER
        ON MEMBER.USER_ID = RECORDING.USER_ID
        JOIN AVATAR
        ON AVATAR.USER_ID = RECORDING.USER_ID
        WHERE RECORDING.RECORDING_ID = ? AND RECORDING.VISIBILITY = ?
        `
        const [data] = await pool.promise().query(sql, [recordingId, 'public']);
        console.log(data);
        
        return res.status(200).json({ 'data':data[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

watchAPI.put('/watch/', async (req, res) => {
    try {
        const recordingId = req.body['recordingId']
        
        let sql = `
        UPDATE RECORDING
        SET VIEWS = VIEWS +1
        WHERE RECORDING.RECORDING_ID = ?
        `
        await pool.promise().query(sql, [recordingId]);
        return res.status(200).json({'ok': true})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
})
module.exports = watchAPI;