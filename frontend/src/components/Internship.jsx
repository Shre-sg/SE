import { useState, useEffect } from 'react';
import axios from 'axios';

const Internship = () => {
    const [internships, setInternships] = useState([]);
    const [formData, setFormData] = useState({
        USN: '',
        Company: '',
        Stipend: '',
        Status: '',
        Start_Date: '',
        Offer_Type: ''
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searched, setSearched] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const response = await axios.get('http://localhost:3000/internship');
            setInternships(response.data);
        } catch (error) {
            console.error('Error fetching internships:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateFormData = () => {
        const newErrors = {};
        const stipendRegex = /^\d+(\.\d{1,2})?$/; // Allows stipend values like 5000, 5000.50

        if (!formData.USN) newErrors.USN = "USN is required.";
        if (!formData.Company) newErrors.Company = "Company is required.";
        if (!stipendRegex.test(formData.Stipend)) newErrors.Stipend = "Invalid Stipend format.";
        if (!formData.Status) newErrors.Status = "Status is required.";
        if (!formData.Start_Date) newErrors.Start_Date = "Start Date is required.";
        if (!formData.Offer_Type) newErrors.Offer_Type = "Offer Type is required.";

        return newErrors;
    };

    const handleAddInternship = async () => {
        const validationErrors = validateFormData();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await axios.post('http://localhost:3000/internship', formData);
            setDialogOpen(false);
            fetchInternships();
        } catch (error) {
            console.error('Error adding internship:', error);
        }
    };

    const handleSearch = () => {
        const trimmedSearchQuery = searchQuery.trim().toLowerCase();

        const filteredInternships = internships.filter(internship => {
            return (
                internship.USN.toLowerCase().includes(trimmedSearchQuery) ||
                internship.Company.toLowerCase().includes(trimmedSearchQuery) ||
                internship.Offer_Type.toLowerCase().includes(trimmedSearchQuery)
            );
        });

        setInternships(filteredInternships);
        setSearched(true);
    };

    const handleResetSearch = () => {
        setSearchQuery('');
        fetchInternships();
        setSearched(false);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Internship Data</h1>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by USN, Company, or Offer Type"
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

            <button className="btn btn-primary mb-3" onClick={() => setDialogOpen(true)}>Add Internship</button>

            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>USN</th>
                            <th>Company</th>
                            <th>Stipend</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>Offer Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {internships.map(internship => (
                            <tr key={internship.USN}>
                                <td>{internship.USN}</td>
                                <td>{internship.Company}</td>
                                <td>{internship.Stipend}</td>
                                <td>{internship.Status}</td>
                                <td>{internship.Start_Date}</td>
                                <td>{internship.Offer_Type}</td>
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
                                <h5 className="modal-title">Add Internship Data</h5>
                                <button type="button" className="close" onClick={() => setDialogOpen(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    name="USN"
                                    placeholder="USN"
                                    onChange={handleInputChange}
                                />
                                {errors.USN && <div className="text-danger">{errors.USN}</div>}
                                <input
                                    type="text"
                                    name="Company"
                                    placeholder="Company"
                                    onChange={handleInputChange}
                                />
                                {errors.Company && <div className="text-danger">{errors.Company}</div>}
                                <input
                                    type="text"
                                    name="Stipend"
                                    placeholder="Stipend"
                                    onChange={handleInputChange}
                                />
                                {errors.Stipend && <div className="text-danger">{errors.Stipend}</div>}
                                <input
                                    type="text"
                                    name="Status"
                                    placeholder="Status"
                                    onChange={handleInputChange}
                                />
                                {errors.Status && <div className="text-danger">{errors.Status}</div>}
                                <input
                                    type="date"
                                    name="Start_Date"
                                    placeholder="Start Date"
                                    onChange={handleInputChange}
                                />
                                {errors.Start_Date && <div className="text-danger">{errors.Start_Date}</div>}
                                <input
                                    type="text"
                                    name="Offer_Type"
                                    placeholder="Offer Type"
                                    onChange={handleInputChange}
                                />
                                {errors.Offer_Type && <div className="text-danger">{errors.Offer_Type}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDialogOpen(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddInternship}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Internship;
