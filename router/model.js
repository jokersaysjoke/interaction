const mysql = require('mysql2')
require('dotenv').config()
const pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    port: "3306"
  });
module.exports=pool