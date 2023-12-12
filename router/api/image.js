const express=require('express');
const s3 = require('../models/awsS3');
const imgAPI=express.Router();
const pool = require('../models/model');
const { jwtVerify, jwtSign } = require('../models/jwt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs=require('fs')

imgAPI.get('/image', async(req, res)=>{
    try {
        const cookie=req.cookies['cookie'];
        const result=jwtVerify(cookie);
        const userId=result.userId

        let sql=`
        SELECT * 
        FROM AVATAR
        WHERE 
        USER_ID = ?
        `
        const [record]=await pool.promise().query(sql, [userId]);
        if(record.length>0){
            const [{ADDRESS:address}]=record;
            return res.status(200).json({'data':{'address':address}})
        }else{
            return res.status(200).json({'data':null})
        }
        
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }

})
imgAPI.post('/image', upload.single('image'), async(req, res)=>{
    try {
        const file=req.file;
        const fileName=file.filename;
        const userID=req.body.userID;
        let sql=`
        SELECT *
        FROM AVATAR
        WHERE USER_ID = ?
        `
        const [record]=await pool.promise().query(sql, [userID])
        if(record.length>0){
            await s3.uploadImg(file);
            let sql=`
            UPDATE AVATAR
            SET ADDRESS = ?
            WHERE USER_ID = ?
            `
            await pool.promise().query(sql, [fileName, userID]);
            fs.unlinkSync(file.path);
            return res.status(200).json({'ok':true})
        }else{
            await s3.uploadImg(file);
            let sql=`
            INSERT INTO
            AVATAR (USER_ID, ADDRESS)
            VALUE (?, ?)
            `
            await pool.promise().query(sql, [userID, fileName]);
            fs.unlinkSync(file.path);
            return res.status(200).json({'ok':true})
        }
        

    } catch (error) {
        console.error('error:', error);
        return res.status(500).json({"error":true, "message":"Database error"});
    }

})
module.exports=imgAPI;