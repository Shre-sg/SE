import { useState, useEffect } from 'react';
import axios from 'axios';

const Student = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        USN: '',
        Name: '',
        Department: '',
        Gender: '',
        Date_of_Birth: '',
        Email: '',
        Secondary_Email: '',
        Phone_Number: '',
        '10th_Percentage': '',
        '12th_Diploma_Percentage': '',
        BE_CGPA: '',
        Active_Backlogs: '',
        History_of_Backlogs: ''
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searched, setSearched] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:3000/student');
            const overriddenData = response.data.map(student => ({
                ...student,
                Gender: cleanString(student.Gender),
                Eligibility_for_Placements: cleanString(student.Eligibility_for_Placements)
            }));
            console.log('Fetched Students:', overriddenData); // Log fetched data
            setStudents(overriddenData);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const cleanString = (str) => {
        return str?.replace(/\s+/g, ' ').trim().toLowerCase();
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const percentageRegex = /^[0-9]{1,2}(\.[0-9]{1,2})?$/; // Allows percentages like 75, 75.50

        if (!formData.USN) newErrors.USN = "USN is required.";
        if (!formData.Name) newErrors.Name = "Name is required.";
        if (!formData.Department) newErrors.Department = "Department is required.";
        if (!formData.Gender) newErrors.Gender = "Gender is required.";
        if (!formData.Date_of_Birth) newErrors.Date_of_Birth = "Date of Birth is required.";
        if (!emailRegex.test(formData.Email)) newErrors.Email = "Invalid Email.";
        if (formData.Secondary_Email && !emailRegex.test(formData.Secondary_Email)) newErrors.Secondary_Email = "Invalid Secondary Email.";
        if (!formData.Phone_Number) newErrors.Phone_Number = "Phone Number is required.";
        if (!percentageRegex.test(formData['10th_Percentage'])) newErrors['10th_Percentage'] = "Invalid 10th Percentage.";
        if (!percentageRegex.test(formData['12th_Diploma_Percentage'])) newErrors['12th_Diploma_Percentage'] = "Invalid 12th/Diploma Percentage.";
        if (!percentageRegex.test(formData.BE_CGPA)) newErrors.BE_CGPA = "Invalid BE CGPA.";
        if (!formData.Active_Backlogs) newErrors.Active_Backlogs = "Active Backlogs is required.";
        if (!formData.History_of_Backlogs) newErrors.History_of_Backlogs = "History of Backlogs is required.";

        return newErrors;
    };

    const handleAddStudent = async () => {
        const validationErrors = validateFormData();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await axios.post('http://localhost:3000/student', formData);
            setDialogOpen(false);
            fetchStudents();
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleSearch = () => {
        const trimmedSearchQuery = cleanString(searchQuery);

        const filteredStudents = students.filter(student => {
            const genderMatch = cleanString(student.Gender) === trimmedSearchQuery;
            const eligibilityMatch = cleanString(student.Eligibility_for_Placements) === trimmedSearchQuery;

            console.log('Searching for:', trimmedSearchQuery, 
                        'Gender found:', student.Gender, 'Gender Match:', genderMatch,
                        'Eligibility found:', student.Eligibility_for_Placements, 'Eligibility Match:', eligibilityMatch);

            return (
                cleanString(student.USN).includes(trimmedSearchQuery) ||
                cleanString(student.Name).includes(trimmedSearchQuery) ||
                cleanString(student.Department).includes(trimmedSearchQuery) ||
                genderMatch ||
                eligibilityMatch
            );
        });

        setStudents(filteredStudents);
        setSearched(true);
    };

    const handleResetSearch = () => {
        setSearchQuery('');
        fetchStudents();
        setSearched(false);
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Student Data</h1>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by USN, Name, Department, Gender, or Eligibility"
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

            <button className="btn btn-primary mb-3" onClick={() => setDialogOpen(true)}>Add Student</button>

            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>USN</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Gender</th>
                            <th>Date of Birth</th>
                            <th>Email</th>
                            <th>Secondary Email</th>
                            <th>Phone Number</th>
                            <th>10th Percentage</th>
                            <th>12th/Diploma Percentage</th>
                            <th>BE CGPA</th>
                            <th>Active Backlogs</th>
                            <th>History of Backlogs</th>
                            <th>Eligibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.USN}>
                                <td>{student.USN}</td>
                                <td>{student.Name}</td>
                                <td>{student.Department}</td>
                                <td>{student.Gender}</td>
                                <td>{student.Date_of_Birth}</td>
                                <td>{student.Email}</td>
                                <td>{student.Secondary_Email}</td>
                                <td>{student.Phone_Number}</td>
                                <td>{student['10th_Percentage']}</td>
                                <td>{student['12th_Diploma_Percentage']}</td>
                                <td>{student.BE_CGPA}</td>
                                <td>{student.Active_Backlogs}</td>
                                <td>{student.History_of_Backlogs}</td>
                                <td>{student.Eligibility_for_Placements}</td>
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
                                <h5 className="modal-title">Add Student Data</h5>
                                <button type="button" className="close" onClick={() => setDialogOpen(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input type="text" name="USN" placeholder="USN" onChange={handleInputChange} />
                                {errors.USN && <div className="text-danger">{errors.USN}</div>}
                                <input type="text" name="Name" placeholder="Name" onChange={handleInputChange} />
                                {errors.Name && <div className="text-danger">{errors.Name}</div>}
                                <input type="text" name="Department" placeholder="Department" onChange={handleInputChange} />
                                {errors.Department && <div className="text-danger">{errors.Department}</div>}
                                <input type="text" name="Gender" placeholder="Gender" onChange={handleInputChange} />
                                {errors.Gender && <div className="text-danger">{errors.Gender}</div>}
                                <input type="date" name="Date_of_Birth" placeholder="Date of Birth" onChange={handleInputChange} />
                                {errors.Date_of_Birth && <div className="text-danger">{errors.Date_of_Birth}</div>}
                                <input type="email" name="Email" placeholder="Email" onChange={handleInputChange} />
                                {errors.Email && <div className="text-danger">{errors.Email}</div>}
                                <input type="email" name="Secondary_Email" placeholder="Secondary Email" onChange={handleInputChange} />
                                {errors.Secondary_Email && <div className="text-danger">{errors.Secondary_Email}</div>}
                                <input type="text" name="Phone_Number" placeholder="Phone Number" onChange={handleInputChange} />
                                {errors.Phone_Number && <div className="text-danger">{errors.Phone_Number}</div>}
                                <input type="text" name="10th_Percentage" placeholder="10th Percentage" onChange={handleInputChange} />
                                {errors['10th_Percentage'] && <div className="text-danger">{errors['10th_Percentage']}</div>}
                                <input type="text" name="12th_Diploma_Percentage" placeholder="12th/Diploma Percentage" onChange={handleInputChange} />
                                {errors['12th_Diploma_Percentage'] && <div className="text-danger">{errors['12th_Diploma_Percentage']}</div>}
                                <input type="text" name="BE_CGPA" placeholder="BE CGPA" onChange={handleInputChange} />
                                {errors.BE_CGPA && <div className="text-danger">{errors.BE_CGPA}</div>}
                                <input type="text" name="Active_Backlogs" placeholder="Active Backlogs" onChange={handleInputChange} />
                                {errors.Active_Backlogs && <div className="text-danger">{errors.Active_Backlogs}</div>}
                                <input type="text" name="History_of_Backlogs" placeholder="History of Backlogs" onChange={handleInputChange} />
                                {errors.History_of_Backlogs && <div className="text-danger">{errors.History_of_Backlogs}</div>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDialogOpen(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddStudent}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Student;
