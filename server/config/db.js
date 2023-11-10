require('dotenv').config();
// connection to data base
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
})

// mysql2 return promise wrapper for async 
module.exports = pool.promise()