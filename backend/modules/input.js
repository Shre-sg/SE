const multer = require('multer');
const xlsx = require('xlsx');
const db = require('./db');

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Function to convert Excel serial date to JavaScript Date
const excelDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(0); // Start with epoch
    dateInfo.setUTCSeconds(utcValue);

    return dateInfo;
};

// Function to parse date string in DD-MMM-YYYY format
const parseDateString = (dateStr) => {
    const [day, month, year] = dateStr.split('-').map(part => part.trim());
    const months = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    return new Date(`${year}-${months[month]}-${day}`);
};

// Function to check if a date is valid
const isValidDate = (d) => {
    return d instanceof Date && !isNaN(d);
};

// Function to handle file upload and data insertion
const uploadAndInsertData = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Read the uploaded Excel file
        const workbook = xlsx.readFile(file.path);

        // Process the "Student List" sheet
        const studentSheetName = 'Student List';
        const studentSheet = workbook.Sheets[studentSheetName];
        const studentData = xlsx.utils.sheet_to_json(studentSheet);

        studentData.forEach((row) => {
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
                        console.error('Error inserting student data:', err);
                    }
                });
            } catch (rowError) {
                console.error('Error processing student row:', row);
                console.error(rowError);
            }
        });

        // Process the "Internship" sheet
        const internshipSheetName = 'Internship';
        const internshipSheet = workbook.Sheets[internshipSheetName];
        const internshipData = xlsx.utils.sheet_to_json(internshipSheet);

        internshipData.forEach((row) => {
            // Skip rows that do not contain valid data
            if (!row['__EMPTY'] || row['R V COLLEGE OF ENGINEERING'] === 'Sl no.' || 
                (typeof row['R V COLLEGE OF ENGINEERING'] === 'string' && row['R V COLLEGE OF ENGINEERING'].includes('PLACEMENTS DETAILS'))) {
                return;
            }

            try {
                const usn = row['__EMPTY'];
                const name = row['__EMPTY_1'];
                const department = row['__EMPTY_2'];
                const company = row['__EMPTY_3'];
                const dateOfOffer = row['__EMPTY_4'];
                const stipend = row['__EMPTY_5'];
                const status = row['__EMPTY_6'];
                const startDate = row['__EMPTY_7'];
                const offerType = row['__EMPTY_8'];

                let offerDate, start;

                if (dateOfOffer === undefined) {
                    console.error('Date of Offer is undefined for row:', row);
                    throw new Error('Invalid date format for Date of Offer');
                } else if (typeof dateOfOffer === 'string') {
                    offerDate = parseDateString(dateOfOffer);
                } else if (typeof dateOfOffer === 'number') {
                    offerDate = excelDateToJSDate(dateOfOffer);
                } else {
                    console.error('Invalid date format for Date of Offer:', dateOfOffer);
                    throw new Error('Invalid date format for Date of Offer');
                }

                if (startDate === undefined) {
                    console.error('Start Date is undefined for row:', row);
                    throw new Error('Invalid date format for Start Date');
                } else if (typeof startDate === 'string') {
                    start = parseDateString(startDate);
                } else if (typeof startDate === 'number') {
                    start = excelDateToJSDate(startDate);
                } else {
                    console.error('Invalid date format for Start Date:', startDate);
                    throw new Error('Invalid date format for Start Date');
                }

                // Check if dates are valid
                if (!isValidDate(offerDate)) {
                    console.error('Invalid date value for Date of Offer:', offerDate);
                    throw new Error('Invalid date value for Date of Offer');
                }

                if (!isValidDate(start)) {
                    console.error('Invalid date value for Start Date:', start);
                    throw new Error('Invalid date value for Start Date');
                }

                // Format dates to YYYY-MM-DD format
                offerDate = offerDate.toISOString().split('T')[0];
                start = start.toISOString().split('T')[0];

                const query = `
                    INSERT INTO Internship (student_id, company_name, offer_date, stipend, status, start_date, offer_type)
                    VALUES ((SELECT student_id FROM Students WHERE usn = ?), ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        company_name = VALUES(company_name),
                        offer_date = VALUES(offer_date),
                        stipend = VALUES(stipend),
                        status = VALUES(status),
                        start_date = VALUES(start_date),
                        offer_type = VALUES(offer_type)
                `;

                const values = [usn, company, offerDate, stipend, status, start, offerType];
                db.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting internship data:', err);
                    }
                });
            } catch (rowError) {
                console.error('Error processing internship row:', row);
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
    uploadAndInsertData,
};
