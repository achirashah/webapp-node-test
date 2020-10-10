const de = require('dotenv').config();
const app = require('./app');
const db=require('./db/db');
const DB_NAME ="nodedb"
app.listen(3000, () => {
  console.log(`App running on port 3000...`);
});
//console.log(process.env.DB_NAME);
db.query('CREATE DATABASE IF NOT EXISTS '+ DB_NAME, function (err) {// create db if not exist
  if (err) throw err;
  db.query('USE '+ DB_NAME, function (err) {
    if (err) throw err;
    db.query('create table IF NOT EXISTS user('
      + 'id varchar(255) NOT NULL,'
      + 'first_name varchar(255) NOT NULL,'
      + 'last_name varchar(255) NOT NULL,'
      + 'username varchar(255) NOT NULL UNIQUE,'
      + 'password varchar(255) NOT NULL,'
      + 'account_created varchar(255) NOT NULL,'
      + 'account_updated varchar(255) NOT NULL,'
      + 'PRIMARY KEY (id)'
      +  ')', function (err) {
          if (err) throw err;
    });
  });
});
