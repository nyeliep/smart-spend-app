import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        }
        catch (error) {
            alert('Registration failed: ' + error.message);
        }
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-white", children: [_jsx("img", { src: "Images/smartspendlogo.png", alt: "SmartSpend", className: "w-40 mb-4" }), _jsx("h2", { className: "text-xl font-semibold mb-4", children: "Register" }), _jsx("input", { type: "text", placeholder: "Name", className: "border rounded-lg p-2 w-72 mb-2", value: name, onChange: (e) => setName(e.target.value) }), _jsx("input", { type: "email", placeholder: "Email", className: "border rounded-lg p-2 w-72 mb-2", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("input", { type: "password", placeholder: "Password", className: "border rounded-lg p-2 w-72 mb-2", value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("input", { type: "password", placeholder: "Confirm Password", className: "border rounded-lg p-2 w-72 mb-4", value: confirm, onChange: (e) => setConfirm(e.target.value) }), _jsx("button", { onClick: handleRegister, className: "bg-primary text-white px-6 py-2 rounded-lg w-72", children: "Register" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["Already have an account? ", _jsx(Link, { to: "/login", className: "text-primary", children: "Login" })] })] }));
}
