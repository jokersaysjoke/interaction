const express=require('express');
const pool=require('../model');
const msgAPI=express.Router();

// preview all of chatroom message
msgAPI.get('/message', async(req, res)=>{
    try {
        let sql=`
        SELECT *
        FROM MESSAGE
        WHERE CHATROOM_ID = ?
        ORDER BY ID ASC
        `;
        const room=req.query.room;
        const [record]=await pool.promise().query(sql, [room]);
        
        if(record.length>0){
            return res.status(200).json({data:record})
        }else{
            return res.status(200).json({data: null})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({"error":true, "message":"Database error"});
    }

})

// msgAPI.post('/message', async(req, res)=>{
//     try {
//         const sql=`
//         INSERT INTO MESSAGE (CHATROOM_ID, IMAGE_URL, CREATED_AT, USER_ID, CONTENT)
//         VALUES (?,?,?,?,?)
//         `;
//         const data=req.body;
//         const room=data.room;
//         const avatar=data.avatar;
//         const time=data.time;
//         const user=data.user;
//         const msg=data.msg;

//         await pool.promise().query(sql, [room, avatar, time, user, msg]);
//         return res.status(200).json({'ok': true});
        
//     } catch (error) {
//         console.error(err);
//         return res.status(500).json({"error":true, "message":"Database error"});
//     }
// });

msgAPI.delete('/message', async(req, res)=>{
    try {
        let sql=`
        DELETE FROM MESSAGE
        WHERE CHATROOM_ID = ?
        `;
        const body=req.body;
        const room=body.room;
        await pool.promise().query(sql, [room]);
        return res.status(200).json({'ok': true});
    } catch (error) {
        console.error(error);
        return res.status(500).json({"error":true, "message":"Database error"});
    }
});
module.exports=msgAPI;