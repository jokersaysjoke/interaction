const express = require('express')
const pool = require('./model')
const room = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { jwtVerify, jwtSign } = require('./jwt');
room.use(cookieParser());
room.use(bodyParser.json());

room.get('/:ID', async (req, res) => {
    try {
        const { ID } = req.params;
        let sql = `
        SELECT 
        ROOM.*,
        MEMBER.NAME

        FROM ROOM
        
        JOIN
        MEMBER
        ON
        MEMBER.USER_ID = ROOM.USER_ID

        WHERE 
        MEMBER.NAME = ?
        AND 
        STATUS = ?
        `;
        const cookie = req.cookies['cookie'];
        const response = jwtVerify(cookie);
        const userName = response['name'];
        const [record] = await pool.promise().query(sql, [ID, 'LIVE']);
        if (record !== null) {
            const [{ NAME }] = record
            if (NAME === userName) {
                res.redirect(`/live/${ID}`)
            } else if (cookie) {
                res.render('chatroom.ejs', {})
            } else {
                res.redirect(`/`)
            }
        } else {
            res.redirect(`/`)
        }
    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({ "error": true, "message": "Database error" });

    }
});

room.get('/', async (req, res) => {
    res.redirect(`/`)

});

module.exports = room;
