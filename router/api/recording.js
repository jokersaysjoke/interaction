const express = require('express');
const pool = require('../models/model');
const recordAPI = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

recordAPI.use(cookieParser());
recordAPI.use(bodyParser.json());

recordAPI.put('/recording', async (req, res) => {
    try {
        const recordingId = req.body['recordingId'];
        const visibility = req.body['visibility'];
        let sql = `
            UPDATE RECORDING
            SET VISIBILITY = ?
            WHERE RECORDING_ID = ?
        `;

        await pool.promise().query(sql, [visibility, recordingId]);
        return res.status(200).json({'ok':true});
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

recordAPI.delete('/recording', async (req, res) => {
    try {
        const recordingId = req.body['recordingId'];
        let sql = `
            DELETE RECORDING
            FROM RECORDING
            WHERE RECORDING.RECORDING_ID = ?
        `;
        await pool.promise().query(sql, [recordingId]);
        return res.status(200).json({'ok': true});
        
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});
module.exports = recordAPI;