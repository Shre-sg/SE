const mysql = require('mysql2');

//shreyas db
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Lingaiah@60',
//     database: 'PLACEMENT', //RV_COLLEGE_PLACEMENT
// });

////spoorthi db
const db = mysql.createConnection({
  host: 'mysql-2c83732b-shreyasg-5f50.h.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_QDqZodIseE2sz48Ax1H',
  database: 'PLACEMENT',
  port : '21146',
});

////sanjana db
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Lingaiah@60',
//   database: 'team_database',
// });


db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
    }
});

module.exports = db;
