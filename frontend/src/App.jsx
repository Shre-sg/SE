import 'bootswatch/dist/lux/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'; 
const App = () => {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
        <Route path="/" element={<Dashboard />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;