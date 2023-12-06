const express = require('express');
const pool = require('../models/model');
const s3API = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const s3 = require('../models/awsS3');
const uuid = require('uuid');
const current = require('../models/currentTime')

s3API.use(cookieParser());
s3API.use(bodyParser.json());


s3API.get('/s3', async (req, res) => {
    try {
        let sql = `
        SELECT *
        FROM AVATAR
        ORDER BY ID DESC
      `;
        const [rows, fields] = await pool.promise().query(sql);
        return res.status(200).json({ "data": rows });
    } catch (error) {
        return res.status(500).json({ "error": true, "message": "Database error" });

    }
});

s3API.post('/s3', async (req, res) => {
    try {
        let sql = `
        INSERT INTO
        RECORDING (RECORDING_ID, USER_ID, CONTENT, CREATED_AT)
        VALUES (?,?,?,?)
        `
        const streamkey = req.body.streamkey;
        const content = req.body.head;
        const userId = req.body.userId;
        const recordingId = uuid.v4();
        const createdAt = current.getTaipeiTime;

        await s3.uploadFile(streamkey, recordingId);
        await pool.promise().query(sql, [recordingId, userId, content, createdAt])

        return res.status(200).json({ data: true });
    } catch (error) {
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

module.exports = s3API;