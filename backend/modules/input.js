const multer = require('multer');
const xlsx = require('xlsx');
const db = require('./db');

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// i got few earros wiht excwl sheet format ie ive modified it
// Function to convert Excel serial date to JavaScript Date
const excelDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(0); // Start with epoch
    dateInfo.setUTCSeconds(utcValue);

    return dateInfo;
};

// Function to handle file upload and data insertion
const uploadAndInsert = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Read the uploaded Excel file
        const workbook = xlsx.readFile(file.path);
        const sheetName = 'Student List';
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Insert data into the database
        data.forEach((row) => {
            try {
                const {
                    'College Email ID': collegeEmail,
                    'Personal Email ID': personalEmail,
                    'Name': name,
                    'USN': usn,
                    'Branch': branch,
                    'Gender': gender,
                    'Date of Birth (DD/MM/YYYY)': dateOfBirth,
                    'Mobile': mobile,
                    '10th Percentage': percentage_10th,
                    '12th/Diploma Percentage': percentage_12th,
                    'BE CGPA': be_cgpa,
                    'Active Backlogs': backlogs,
                    'History of Backlogs (YES/NO)': historyOfBacklogs,
                } = row;

                let dob;
                if (typeof dateOfBirth === 'string') {
                    const [day, month, year] = dateOfBirth.split('/');
                    dob = new Date(`${year}-${month}-${day}`); // Parse date string
                } else if (typeof dateOfBirth === 'number') {
                    dob = excelDateToJSDate(dateOfBirth); // Convert Excel serial date
                } else {
                    throw new Error('Invalid date format');
                }

                // Format date to YYYY-MM-DD format
                dob = dob.toISOString().split('T')[0];

                const query = `
                INSERT INTO Students (college_email, personal_email, name, usn, branch, gender, date_of_birth, mobile, percentage_10th, percentage_12th, be_cgpa, backlogs, history_of_backlogs)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    personal_email = VALUES(personal_email),
                    name = VALUES(name),
                    branch = VALUES(branch),
                    gender = VALUES(gender),
                    date_of_birth = VALUES(date_of_birth),
                    mobile = VALUES(mobile),
                    percentage_10th = VALUES(percentage_10th),
                    percentage_12th = VALUES(percentage_12th),
                    be_cgpa = VALUES(be_cgpa),
                    backlogs = VALUES(backlogs),
                    history_of_backlogs = VALUES(history_of_backlogs)
            `;
            
            const values = [collegeEmail, personalEmail, name, usn, branch, gender, dob, mobile, percentage_10th, percentage_12th, be_cgpa, backlogs, historyOfBacklogs];
                db.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                    }
                });
            } catch (rowError) {
                console.error('Error processing row:', row);
                console.error(rowError);
            }
        });

        res.send('File uploaded and data inserted.');
    } catch (error) {
        console.error('Error processing the file:', error);
        res.status(500).send('Error processing the file.');
    }
};

module.exports = {
    upload,
    uploadAndInsert,
};
