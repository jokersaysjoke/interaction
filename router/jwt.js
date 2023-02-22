require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const secret = process.env.secret;
const app = express();
app.use(cookieParser());

function jwtVerify(cookie) {
    const response = jwt.verify(cookie, secret);
    return response

};

function jwtSign(id, name, email, streamkey) {
    const token = jwt.sign({
        id,
        name,
        email,
        streamkey
    }, secret);
    return token;
};

module.exports={
    jwtVerify: jwtVerify,
    jwtSign: jwtSign
}