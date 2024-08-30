<<<<<<< HEAD


=======
require('dotenv').config();
>>>>>>> bbf24a29e0ad9ca63da5ec45d8e4e2f73c69edc1
const mysql = require('mysql2');

//shreyas db
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Lingaiah@60',
//     database: 'PLACEMENT', //RV_COLLEGE_PLACEMENT
// });

const db = mysql.createConnection({
  host: 'mysql-2c83732b-shreyasg-5f50.h.aivencloud.com',
  user: 'avnadmin',
  password: process.env.PASS,  // Use the environment variable
  database: 'PLACEMENT',
  port: '21146',
});

////spoorthi db



// const db = mysql.createConnection({
//   host: 'mysql-2c83732b-shreyasg-5f50.h.aivencloud.com',
//   user: 'avnadmin',
//   password: process.env.AIVEN_SERVICE_PASSWORD,  // Use the environment variable
//   database: 'PLACEMENT',
//   port: '21146',
// });

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
