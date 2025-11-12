import { useState } from 'react';
import { registerUser } from '../services/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }
    try {
      await registerUser(email, password, name);
      navigate('/dashboard');
    } catch (error) {
      alert('Registration failed: ' + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <img src="Images/smartspendlogo.png" alt="SmartSpend" className="w-40 mb-4" />
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <input
        type="text"
        placeholder="Name"
        className="border rounded-lg p-2 w-72 mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border rounded-lg p-2 w-72 mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border rounded-lg p-2 w-72 mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="border rounded-lg p-2 w-72 mb-4"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="bg-primary text-white px-6 py-2 rounded-lg w-72"
      >
        Register
      </button>
      <p className="mt-2 text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-primary">Login</Link>
      </p>
    </div>
  );
}
