const mysql = require('mysql2');
require('dotenv').config();

// RDS MYSQL
const mysql_host=process.env.AWS_RDS_HOST;
const mysql_user=process.env.AWS_RDS_USER;
const mysql_password=process.env.AWS_RDS_PASSWORD;
const mysql_database=process.env.AWS_RDS_DATABASE;

// connectionPool
const pool = mysql.createPool({
  connectionLimit : 10,
  host: mysql_host,
  user: mysql_user,
  password: mysql_password,
  database: mysql_database,
  port: "3306"
});



module.exports=pool;