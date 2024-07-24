import { useState, useEffect } from 'react';
import axios from 'axios';

const Placement = () => {
    const [originalData, setOriginalData] = useState([]);
    const [joinedData, setJoinedData] = useState([]);
    const [formData, setFormData] = useState({
        USN: '',
        Company: '',
        Type: '',
        CTC: '',
        Category: '',
        Remarks: '',
        Offer_Date: '',
        Start_Date_Internship: ''
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/placement');
            setOriginalData(response.data);
            setJoinedData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddData = async () => {
        try {
            await axios.post('http://localhost:3000/placement', formData);
            setDialogOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const handleSearch = () => {
        const trimmedSearchQuery = searchQuery.trim().toLowerCase();

        const filteredData = originalData.filter(row => {
            return (
                row.USN.toLowerCase().includes(trimmedSearchQuery) ||
                row.Company.toLowerCase().includes(trimmedSearchQuery)
            );
        });

        setJoinedData(filteredData);
        setSearched(true);
    };

    const handleResetSearch = () => {
        setSearchQuery('');
        setJoinedData(originalData);
        setSearched(false);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Placement Data</h1>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by USN or Company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>Search</button>
                </div>
            </div>

            {searched && (
                <button className="btn btn-secondary mb-3" onClick={handleResetSearch}>Reset Search</button>
            )}

            <button className="btn btn-primary mb-3" onClick={() => setDialogOpen(true)}>Add Data</button>

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>USN</th>
                            <th>Company</th>
                            <th>Type</th>
                            <th>CTC</th>
                            <th>Category</th>
                            <th>Remarks</th>
                            <th>Offer Date</th>
                            <th>Start Date (Internship)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {joinedData.map(row => (
                            <tr key={row.USN}>
                                <td>{row.USN}</td>
                                <td>{row.Company}</td>
                                <td>{row.Type}</td>
                                <td>{row.CTC}</td>
                                <td>{row.Category}</td>
                                <td>{row.Remarks}</td>
                                <td>{row.Offer_Date}</td>
                                <td>{row.Start_Date_Internship}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {dialogOpen && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Placement Data</h5>
                                <button type="button" className="close" onClick={() => setDialogOpen(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input type="text" name="USN" placeholder="USN" onChange={handleInputChange} />
                                <input type="text" name="Company" placeholder="Company" onChange={handleInputChange} />
                                <input type="text" name="Type" placeholder="Type" onChange={handleInputChange} />
                                <input type="text" name="CTC" placeholder="CTC" onChange={handleInputChange} />
                                <input type="text" name="Category" placeholder="Category" onChange={handleInputChange} />
                                <input type="text" name="Remarks" placeholder="Remarks" onChange={handleInputChange} />
                                <input type="date" name="Offer_Date" placeholder="Offer Date" onChange={handleInputChange} />
                                <input type="date" name="Start_Date_Internship" placeholder="Start Date (Internship)" onChange={handleInputChange} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDialogOpen(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddData}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Placement;
