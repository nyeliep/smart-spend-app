import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed: ' + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src="/Images/smartspendlogo.png" alt="SmartSpend" className="w-40 mb-4" />
      <h2 className="text-xl font-semibold mb-4">Login</h2>
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
        className="border rounded-lg p-2 w-72 mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-primary text-white px-6 py-2 rounded-lg"
      >
        Login
      </button>
      <p className="mt-2 text-sm text-gray-600">
        Don’t have an account? <Link to="/register" className="text-primary">Register</Link>
      </p>
    </div>
  );
}
