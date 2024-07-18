
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');


const { upload, uploadAndInsertData } = require('./modules/input');
const { extractAndInsertInternshipData } = require('./modules/input2');
const { getAllData } = require('./modules/all');
const { getDreamOpenDreamCounts } = require('./modules/cato');
const { getPlacementCTCStats } = require('./modules/ctc');
const { calculateOfferStatistics } = require('./modules/type');
const { insertStudent } = require('./modules/student');
const { insertInternship } = require('./modules/internship');
const { insertPlacement } = require('./modules/placement');


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


// Default route
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.post('/students/upload', upload.single('file'), (req, res) => {
    uploadAndInsertData(req, res);
});
app.post('/internships/upload', upload.single('file'), (req, res) => {
    extractAndInsertInternshipData(req.file.path); // Call the function with the file path
    res.send('Internship data upload started.'); // Respond immediately
});
app.get('/all', getAllData);
app.get('/cato', getDreamOpenDreamCounts);
app.get('/ctc', async (req, res) => {
    try {
        const placementStats = await getPlacementCTCStats();

        console.log('Fetched Placement Stats:', placementStats); // Log fetched stats for debugging

        // Sending JSON response with correct field names
        res.json({
            "Count of CTC Values": placementStats["COUNTA of USN"],
            "Average CTC (in lakhs)": placementStats["AVERAGE of CTC (in lakhs)"],
            "Median CTC (in lakhs)": placementStats["MEDIAN of CTC (in lakhs)"]
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error retrieving placement CTC statistics.');
    }
});
app.get('/type', async (req, res) => {
    try {
        const statistics = await calculateOfferStatistics();
        res.json(statistics);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching offer statistics.');
    }
});
app.post('/student', (req, res) => {
    const studentData = req.body;
    insertStudent(studentData, (err, results) => {
        if (err) {
            return res.status(500).send('Error inserting student data.');
        }
        res.send('Student data inserted successfully.');
    });
});
app.post('/internship', (req, res) => {
    const internshipData = req.body;
    insertInternship(internshipData, (err, results) => {
        if (err) {
            return res.status(500).send('Error inserting internship data.');
        }
        res.send('Internship data inserted successfully.');
    });
});
app.post('/placement', (req, res) => {
    const placementData = req.body;
    insertPlacement(placementData, (err, results) => {
        if (err) {
            return res.status(500).send('Error inserting placement data.');
        }
        res.send('Placement data inserted successfully.');
    });
});




// Start the server
app.listen(port, () => {
    console.log(`Listening on PORT ${port}`);
});
