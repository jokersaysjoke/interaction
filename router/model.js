const mysql = require('mysql2');
require('dotenv').config();
console.log('into model.js');
// RDS MYSQL
const rds_host=process.env.AWS_RDS_HOST;
const rds_user=process.env.AWS_RDS_USER;
const rds_password=process.env.AWS_RDS_PASSWORD;
const rds_database=process.env.AWS_RDS_DATABASE;

// connectionPool
const pool = mysql.createPool({
  connectionLimit : 10,
  host: rds_host,
  user: rds_user,
  password: rds_password,
  database: rds_database,
  port: "3306"
});
console.log('host', rds_host);
console.log('user', rds_user);
console.log('database', rds_database);


module.exports=pool;