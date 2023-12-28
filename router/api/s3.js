const express = require('express');
const pool = require('../models/model');
const s3API = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const s3 = require('../models/awsS3');

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
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

s3API.post('/s3', async (req, res) => {
    try {

        const streamkey = req.body.streamkey;
        const recordingId = req.body.recordingId;

        // await s3.uploadFile(streamkey, recordingId);

        return res.status(200).json({ data: true });
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });
    }
});

module.exports = s3API;