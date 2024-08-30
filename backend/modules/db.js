
const mysql = require('mysql2');

//shreyas db
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lingaiah@60',
    database: 'PLACEMENT', //RV_COLLEGE_PLACEMENT
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
