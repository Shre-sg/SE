
const mysql = require('mysql2');

// Database connection configuration (importing pool from your existing db.js)
const pool = require('./db');

// Function to get placement CTC statistics
function getPlacementCTCStats() {
    return new Promise((resolve, reject) => {
        // Query to fetch all CTC values from the placement table
        const query = `
            SELECT CTC
            FROM placement
        `;

        // Execute the query
        pool.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                // Extract numeric CTC values from rows and handle nulls
                const ctcValues = results.map(row => parseFloat(row.CTC)).filter(value => !isNaN(value));
                console.log('Extracted CTC Values:', ctcValues); // Log extracted values for debugging

                // Calculate count, average, and median
                const count = ctcValues.length;
                const sum = ctcValues.reduce((acc, ctc) => acc + ctc, 0);
                const average = count > 0 ? (sum / count).toFixed(2) : 'N/A'; // Handle case where there are no valid CTC values
                console.log('Count:', count);
                console.log('Sum:', sum);
                console.log('Average:', average);

                // Sort CTC values for median calculation
                ctcValues.sort((a, b) => a - b);
                console.log('Sorted CTC Values:', ctcValues); // Log sorted values for debugging

                const median = calculateMedian(ctcValues);
                console.log('Median:', median);

                // Resolve with statistics
                resolve({
                    "COUNTA of USN": count,
                    "AVERAGE of CTC (in lakhs)": average,
                    "MEDIAN of CTC (in lakhs)": median
                });
            }
        });
    });
}

// Helper function to calculate median
function calculateMedian(values) {
    const sortedValues = values.sort((a, b) => a - b);
    const middle = Math.floor(sortedValues.length / 2);
    
    if (sortedValues.length === 0) {
        return 'N/A'; // Handle case where there are no valid CTC values
    }
    
    if (sortedValues.length % 2 === 0) {
        return ((sortedValues[middle - 1] + sortedValues[middle]) / 2).toFixed(2);
    } else {
        return sortedValues[middle].toFixed(2);
    }
}

module.exports = {
    getPlacementCTCStats
};


