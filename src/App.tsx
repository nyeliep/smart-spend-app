import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Report from './Pages/Report';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}
