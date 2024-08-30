import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootswatch/dist/lux/bootstrap.min.css'; // Import Bootswatch Lux theme
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import image1 from '../assets/rvce.logo.png';
import image2 from '../assets/rvce.write.png';

const View = () => {
    const [campusData, setCampusData] = useState(null);
    const [ctcData, setCtcData] = useState(null);
    const [typeData, setTypeData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [campusResponse, ctcResponse, typeResponse, categoryResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_BACKEND_URL}/campus`),
                    axios.get(`${process.env.REACT_APP_BACKEND_URL}/ctc`),
                    axios.get(`${process.env.REACT_APP_BACKEND_URL}/type`),
                    axios.get(`${process.env.REACT_APP_BACKEND_URL}/cato`),
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

    const handleLogout = () => {
        // Implement your logout logic here
        // For example, clearing authentication tokens and redirecting to the login page
        // localStorage.removeItem('authToken');
        navigate('/login'); // Redirect to login page
    };
    
    const handleDeleteAllData = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete`);
            alert('All data deleted successfully.');
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Error deleting data.');
        }
    };
    

    return (
        <div className="container mt-5">
            <div style={{ position: 'absolute', top: '15px', left: '15px', margin: '10px' }}>
                <img src={image1} alt="RVCE Logo" style={{ width: '130px' }} />
            </div>
            <div style={{ position: 'absolute', top: '10px', right: '15px', margin: '10px' }}>
                <img src={image2} alt="RVCE" style={{ width: '300px' }} />
            </div>

            <div className="text-center">
                <h1 style={{ marginTop: '170px' }}>Placement Portal</h1>
            </div>
            <div className="d-flex justify-content-between mb-4" style={{ marginTop: '20px' }}>
                <button className="btn btn-success" onClick={() => navigate('/student')}>Student Data</button>
                <button className="btn btn-primary" onClick={() => navigate('/internship')}>Internship Data</button>
                <button className="btn btn-success" onClick={() => navigate('/placement')}>Placement Data</button>
            </div>

            <div>
                <hr className="my-4" />
            </div>

            <div className="text-center">
                <h2 style={{ marginTop: '30px' }}>On Campus vs Off Campus</h2>
            </div>
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

            <div>
                <hr className="my-4" />
            </div>
            <div className="text-center">
                <h2 style={{ marginTop: '40px' }}>CTC Statistics</h2>
            </div>
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
                                <td>{ctcData['MAX of CTC (in lakhs)']}</td>
                            </tr>
                            <tr>
                                <td>Average CTC</td>
                                <td>{ctcData['Average CTC (in lakhs)']}</td>
                            </tr>
                            <tr>
                                <td>Median CTC</td>
                                <td>{ctcData['Median CTC (in lakhs)']}</td>
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

            <div>
                <hr className="my-4" />
            </div>
            <div className="text-center">
                <h2 style={{ marginTop: '40px' }}>Offer Type Counts</h2>
            </div>
            
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

            <div>
                <hr className="my-4" />
            </div>
            <div className="text-center">
                <h2 style={{ marginTop: '40px' }}>Category Counts</h2>
            </div>
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

                <div className="d-flex justify-content-between mb-4" style={{ marginTop: '40px' }}>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    <button className="btn btn-primary" onClick={() => navigate('/all')}>Data Page</button>
                    <button className="btn btn-warning" onClick={handleDeleteAllData}>Delete All Data</button> {/* New button */}
                </div>

        </div>
    );
};

export default View;
