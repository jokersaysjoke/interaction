require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const secret = process.env.secret;
const app = express();
app.use(cookieParser());

function jwtVerify(cookie) {
    const result=cookie.split("cookie=")[1]
    const response = jwt.verify(result, secret);
    if(response!==null){
        console.log(response);
    return response
    }else{
        console.log(response);
        return {response:null};
    }
};

function jwtSign(id, name, email) {
    const token = jwt.sign({
        id,
        name,
        email
    }, secret);
    return token;
};

module.exports={
    jwtVerify: jwtVerify,
    jwtSign: jwtSign
}