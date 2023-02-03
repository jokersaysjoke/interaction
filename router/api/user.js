const express = require('express')
const pool = require('../model')
const userAPI = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { jwtVerify, jwtSign } = require('../jwt');
userAPI.use(cookieParser());
userAPI.use(bodyParser.json());

// 登入狀態
userAPI.get('/user', (req, res) => {
  const cookie=req.headers.cookie
  try {
    if(cookie){
      const response=jwtVerify(cookie);
      if(response){
        const id=response['id'];
        const name=response['name'];
        const email=response['email'];
        return res.status(200).json({"data":{'id':id, 'name':name, 'email':email}});
      }else{
        return res.json({"data":null});
      }
    }else{
      return res.json({"data":null});
    }
  } catch (error) {
      return res.status(500).json({"error":true, "message":"Database error"});
  }
 });

//  登入
userAPI.put('/user', async (req, res) => {
  const data=req.body;
  const email=data.email, password=data.password;
  let sql = `SELECT *
             FROM MEMBER
             WHERE (EMAIL = ? AND PASSWORD = ?)
             OR (NAME = ? AND PASSWORD = ?)`;
  try {
    const [record] = await pool.promise().query(sql, [email, password, email, password])
    if(record.length > 0){
      const result=Object.assign({}, record[0]);
      const token=jwtSign(result.ID, result.NAME, result.EMAIL);
      res.cookie('cookie', token);
      return res.status(200).json({"ok":true});
    }else{
      return res.status(400).json({"error":true, "message":"wrong type"});
    }
  } 
  catch (error) {
    return res.status(500).json({"error":true, "message":"Database error"});
  }
})

// 登出
userAPI.delete('/user', (req, res) => {
  res.clearCookie('cookie');
  return res.status(200).json({"ok": true});
})

//  註冊
userAPI.post('/user', async (req, res) => {
  const data=req.body;
  const name=data.name, email=data.email, password=data.password;
  let sql = `
  SELECT *
  FROM MEMBER
  WHERE EMAIL = ?`;
  try {
    const [record] = await pool.promise().query(sql, [email]);
    if(record.length > 0){
      return res.status(400).json({"error":true, "message":"Email already exist"});
    }else{
      let sql = `INSERT INTO MEMBER (NAME, EMAIL, PASSWORD) 
                 VALUES (?,?,?)`;

      await pool.promise().query(sql, [name, email, password]);
      return res.status(200).json({"ok":true});
    }
  } 
  catch (error) {
      return res.status(500).json({"error":true, "message":"Database error"});
  }
});
module.exports=userAPI