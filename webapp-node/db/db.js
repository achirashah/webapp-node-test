const de =require('dotenv').config();
const mysql = require('mysql');
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port:3300,
    password:'pass1234',
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err){
        console.log('DB connection succeded.');
    }
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

module.exports = mysqlConnection;