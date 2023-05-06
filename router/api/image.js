const express=require('express');
const s3 = require('../awsS3');
const imgAPI=express.Router();
const pool = require('../model');
const { jwtVerify, jwtSign } = require('../jwt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

imgAPI.get('/image', async(req, res)=>{
    try {
        const cookie=req.cookies['cookie'];
        const result=jwtVerify(cookie);
        const host=result.email

        let sql=`
        SELECT * 
        FROM CONNECT
        WHERE 
        CONTENT = ?
        `
        const [record]=await pool.promise().query(sql, [host]);
        const [{ADDRESS:address}]=record;
        console.log(address);
        return res.status(200).json({'data':{'address':address}})
    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }

})
imgAPI.post('/image', upload.single('image'), async(req, res)=>{
    try {
        const file=req.file;
        const fileName=file.filename;
        const content=req.body.host;
        await s3.uploadImg(file);
        let sql=`
        INSERT INTO
        CONNECT (CONTENT, ADDRESS)
        VALUE (?, ?)
        `
        await pool.promise().query(sql, [content, fileName]);
        
        return res.status(200).json({'ok':true})

    } catch (error) {
        return res.status(500).json({"error":true, "message":"Database error"});
    }

})
module.exports=imgAPI;