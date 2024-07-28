import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootswatch/dist/lux/bootstrap.min.css'; // Import Bootswatch Lux theme
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const View = () => {
    const [campusData, setCampusData] = useState(null);
    const [ctcData, setCtcData] = useState(null);
    const [typeData, setTypeData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [campusResponse, ctcResponse, typeResponse, categoryResponse] = await Promise.all([
                    axios.get('http://localhost:3000/campus'),
                    axios.get('http://localhost:3000/ctc'),
                    axios.get('http://localhost:3000/type'),
                    axios.get('http://localhost:3000/cato'),
                ]);

                setCampusData(campusResponse.data);
                setCtcData(ctcResponse.data);
                setTypeData(typeResponse.data);
                setCategoryData(categoryResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const tableStyle = {
        marginBottom: '2rem'
    };

    const pieData = campusData ? {
        labels: ['On Campus', 'Off Campus'],
        datasets: [{
            data: [campusData.On_Campus, campusData.Off_Campus],
            backgroundColor: ['#007bff', '#dc3545'],
        }],
    } : null;

    const pieOptions = {
        maintainAspectRatio: false,
    };

    const barData = ctcData ? {
        labels: ['MAX CTC', 'Average CTC', 'Median CTC'],
        datasets: [{
            label: 'CTC Metrics (in Lakhs)',
            data: [ctcData['MAX of CTC (in lakhs)'], ctcData['Average CTC (in lakhs)'], ctcData['Median CTC (in lakhs)']],
            backgroundColor: ['#007bff', '#28a745', '#ffc107'],
        }],
    } : null;

    const barOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    };

    // Offer type bar chart data
    const offerTypeBarData = typeData ? {
        labels: ['FTE', 'FTE+Internship', 'FTE+Internship (PBC)', 'Internship'],
        datasets: [{
            label: 'Offer Type Counts',
            data: [typeData.FTE, typeData['FTE+Internship'], typeData['FTE+Internship (PBC)'], typeData.Internship],
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
        }],
    } : null;

    const offerTypeBarOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    };

    // Category pie chart data
    const categoryPieData = categoryData ? {
        labels: ['Dream', 'Open Dream', 'No PPO'],
        datasets: [{
            data: [categoryData.Dream, categoryData.Open_Dream, categoryData.No_PPO],
            backgroundColor: ['#007bff', '#28a745', '#ffc107'],
        }],
    } : null;

    const categoryPieOptions = {
        maintainAspectRatio: false,
    };

    return (
        <div className="container">
            <h2>On Campus vs Off Campus</h2>
            {campusData ? (
                <>
                    <table className="table table-bordered table-striped" style={tableStyle}>
                        <thead className="thead-dark">
                            <tr>
                                <th>Category</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>On Campus</td>
                                <td>{campusData.On_Campus}</td>
                            </tr>
                            <tr>
                                <td>Off Campus</td>
                                <td>{campusData.Off_Campus}</td>
                            </tr>
                            <tr>
                                <td>Grand Total</td>
                                <td>{campusData.Grand_Total}</td>
                            </tr>
                        </tbody>
                    </table>
                    {pieData && (
                        <div style={{ width: '340px', height: '340px', margin: 'auto' }}>
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    )}
                </>
            ) : <p>Loading...</p>}

            <h2>CTC Statistics</h2>
            {ctcData ? (
                <>
                    <table className="table table-bordered table-striped" style={tableStyle}>
                        <thead className="thead-dark">
                            <tr>
                                <th>CTC Metric</th>
                                <th>Value (in lakhs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>MAX CTC</td>
                                <td>{ctcData['MAX CTC']}</td>
                            </tr>
                            <tr>
                                <td>Average CTC</td>
                                <td>{ctcData['Average CTC']}</td>
                            </tr>
                            <tr>
                                <td>Median CTC</td>
                                <td>{ctcData['Median CTC']}</td>
                            </tr>
                        </tbody>
                    </table>
                    {barData && (
                        <div style={{ width: '400px', height: '400px', margin: 'auto' }}>
                            <Bar data={barData} options={barOptions} />
                        </div>
                    )}
                </>
            ) : <p>Loading...</p>}

            <h2>Offer Type Counts</h2>
            {typeData ? (
                <>
                    <table className="table table-bordered table-striped" style={tableStyle}>
                        <thead className="thead-dark">
                            <tr>
                                <th>Offer Type</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>FTE</td>
                                <td>{typeData.FTE}</td>
                            </tr>
                            <tr>
                                <td>FTE+Internship</td>
                                <td>{typeData['FTE+Internship']}</td>
                            </tr>
                            <tr>
                                <td>FTE+Internship (PBC)</td>
                                <td>{typeData['FTE+Internship (PBC)']}</td>
                            </tr>
                            <tr>
                                <td>Internship</td>
                                <td>{typeData.Internship}</td>
                            </tr>
                            <tr>
                                <td>Grand Total</td>
                                <td>{typeData['Grand Total']}</td>
                            </tr>
                        </tbody>
                    </table>
                    {offerTypeBarData && (
                        <div style={{ width: '400px', height: '400px', margin: 'auto' }}>
                            <Bar data={offerTypeBarData} options={offerTypeBarOptions} />
                        </div>
                    )}
                </>
            ) : <p>Loading...</p>}

            <h2>Category Counts</h2>
            {categoryData ? (
                <>
                    <table className="table table-bordered table-striped" style={tableStyle}>
                        <thead className="thead-dark">
                            <tr>
                                <th>Category</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Dream</td>
                                <td>{categoryData.Dream}</td>
                            </tr>
                            <tr>
                                <td>Open Dream</td>
                                <td>{categoryData.Open_Dream}</td>
                            </tr>
                            <tr>
                                <td>No PPO</td>
                                <td>{categoryData.No_PPO}</td>
                            </tr>
                            <tr>
                                <td>Grand Total</td>
                                <td>{categoryData.Grand_Total}</td>
                            </tr>
                        </tbody>
                    </table>
                    {categoryPieData && (
                        <div style={{ width: '340px', height: '340px', margin: 'auto' }}>
                            <Pie data={categoryPieData} options={categoryPieOptions} />
                        </div>
                    )}
                </>
            ) : <p>Loading...</p>}
        </div>
    );
};

export default View;
