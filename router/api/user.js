const express = require('express')
const pool = require('../models/model')
const userAPI = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const uuid = require('uuid')
const { jwtVerify, jwtSign } = require('../models/jwt');
const current = require('../models/currentTime');
userAPI.use(cookieParser());
userAPI.use(bodyParser.json());

// 登入狀態
userAPI.get('/user', async (req, res) => {
  try {
    const cookie = req.cookies['cookie'];
    let sql = `
    SELECT ID, NAME, EMAIL, STREAMKEY, USER_ID
    FROM MEMBER
    WHERE EMAIL = ?
    `;
    if (cookie) {
      const response = jwtVerify(cookie);
      const target = response.email
      const [record] = await pool.promise().query(sql, [target]);
      const [{ ID: id }] = record
      const [{ NAME: name }] = record
      const [{ EMAIL: email }] = record
      const [{ STREAMKEY: streamkey }] = record
      const [{ USER_ID: userId}] = record
      
      let sql2 = `
      SELECT *
      FROM ROOM
      WHERE HOST = ?
      `;
      const [room] = await pool.promise().query(sql2, [name]);
      if (email === 'host') {
        let sql3 = `
        SELECT * FROM LOGIN_HISTORY
        ORDER BY ID DESC;
        `
        const [histroy] = await pool.promise().query(sql3, []);
        return res.status(200).json({ "data": { 'id': id, 'name': name, 'email': email, 'streamkey': streamkey, 'room': room.length, 'history': histroy } });
      } else {
        return res.status(200).json({ "data": { 'id': id, 'name': name, 'email': email, 'streamkey': streamkey, 'room': room.length, 'userId': userId } });
      }

    } else {
      return res.json({ "data": null });
    }

  } catch (error) {
    return res.status(500).json({ "error": true, "message": "Database error" });
  }
});

//  登入
userAPI.put('/user', async (req, res) => {
  try {
    const data = req.body;
    const email = data.email, password = data.password;
    let sql = `SELECT *
               FROM MEMBER
               WHERE (EMAIL = ? AND PASSWORD = ?)
               OR (NAME = ? AND PASSWORD = ?)`;
    const [record] = await pool.promise().query(sql, [email, password, email, password])
    if (record.length > 0) {
      const result = Object.assign({}, record[0]);
      const token = jwtSign(result.ID, result.NAME, result.EMAIL, result.STREAMKEY);
      res.cookie('cookie', token);
      return res.status(200).json({ "ok": true });
    } else {
      return res.status(400).json({ "error": true, "message": "wrong type" });
    }
  }
  catch (error) {
    return res.status(500).json({ "error": true, "message": "Database error" });
  }
})

// 登出
userAPI.delete('/user', (req, res) => {
  res.clearCookie('cookie');
  return res.status(200).json({ "ok": true });
})

// 註冊
userAPI.post('/user', async (req, res) => {
  try {
    const data = req.body;
    const name = data.name, email = data.email, password = data.password, streamkey = data.streamkey;
    const userId = uuid.v4();
    const createdAt = current.getFormattedTime()
    let sql = `
    SELECT *
    FROM MEMBER
    WHERE EMAIL = ?`;
    const [record] = await pool.promise().query(sql, [email]);

    if (record.length > 0) {
      return res.status(400).json({ "error": true, "message": "Email already exist" });
    } else {
      let sql = `INSERT INTO MEMBER (NAME, EMAIL, PASSWORD, STREAMKEY, USER_ID, CREATED_AT) 
                 VALUES (?,?,?,?,?,?)`;

      await pool.promise().query(sql, [name, email, password, streamkey, userId, createdAt]);
      return res.status(200).json({ "ok": true });
    }
  }
  catch (error) {
    return res.status(500).json({ "error": true, "message": "Database error" });
  }
});

userAPI.put('/user/update', async (req, res) => {
  try {
    const cookie = req.cookies['cookie'];
    const data = req.body;
    if (data.new) {
      const newName = data.new;
      const email = data.email;

      let sql = `
      UPDATE MEMBER
      SET NAME = ?
      WHERE EMAIL = ?
      `
      await pool.promise().query(sql, [newName, email])
      return res.status(200).json({ ok: true });
    }

    if (data.pw) {
      const pw = data.pw;
      const newPw = data.newPw
      const email = data.email;
      let sql = `
      SELECT PASSWORD
      FROM MEMBER
      WHERE EMAIL = ?
      `
      const [record] = await pool.promise().query(sql, [email]);
      const [{ PASSWORD: oldPw }] = record
      if (oldPw === pw) {
        let sql2 = `
        UPDATE MEMBER
        SET PASSWORD = ?
        WHERE EMAIL = ?
        `
        await pool.promise().query(sql2, [newPw, email])
        return res.status(200).json({ ok: true });
      } else {
        return res.status(200).json({ error: true });
      }
    }

  } catch (error) {
    return res.status(500).json({ "error": true, "message": "Database error" });
  }
});

userAPI.post('/user/post', async (req, res) => {
  try {
    let sql = `
    INSERT INTO LOGIN_HISTORY (USER_ID, LOGIN_TIME)
    VALUES (?,?)
    `
    const data = req.body;
    const user = data.email;
    const time = data.time;
    await pool.promise().query(sql, [user, time]);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ "error": true, "message": "Database error" });
  }
});

userAPI.get('/user/auth', async (req, res) => {
  try {
    const cookie = req.cookies['cookie'];
    if (cookie) {
      const sql = `
      SELECT MEMBER.NAME, AVATAR.ADDRESS
      FROM MEMBER
      JOIN AVATAR
      ON MEMBER.EMAIL = AVATAR.EMAIL
      WHERE MEMBER.EMAIL = ?
      `
      const response = jwtVerify(cookie);
      const email = response.email
      const [data] = await pool.promise().query(sql, [email]);
      const [{ NAME: name }] = data;
      const [{ ADDRESS: address }] = data;

      return res.status(200).json({ 'data': { 'name': name, 'address': address } })

    } else {
      return res.status(403).json({ 'data': null })
    }

  } catch (error) {
    return res.status(500).json({ "error": true, "message": "Database error" });
  }
})

module.exports = userAPI;
