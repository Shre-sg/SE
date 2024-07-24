import 'bootswatch/dist/lux/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'; 
import Placement from './components/Placement';
import Student from './components/Student';
import Internship from './components/Internship';
import AllData from './components/All';

const App = () => {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/placement" element={<Placement />} />
        <Route path="/student" element={<Student />} />
        <Route path="/internship" element={<Internship />} />
        <Route path="/all" element={<AllData />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;