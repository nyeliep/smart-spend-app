import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm">
      <h1 className="font-bold text-primary text-lg">SmartSpend</h1>
      <div className="space-x-4 text-sm">
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button onClick={() => navigate('/add-expense')}>Add</button>
        <button onClick={() => navigate('/report')}>Report</button>
        <button
          onClick={handleLogout}
          className="text-red-500 font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
