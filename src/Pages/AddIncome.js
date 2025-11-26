import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { addIncome } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
export default function AddIncome() {
    const [source, setSource] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const handleSave = async () => {
        if (!currentUser) {
            alert('You must be logged in to add income');
            navigate('/login');
            return;
        }
        if (!source || !amount || !date) {
            alert('Please fill in all required fields');
            return;
        }
        if (Number(amount) <= 0) {
            alert('Amount must be greater than 0');
            return;
        }
        if (!currentUser?.uid)
            return;
        try {
            await addIncome({
                userId: currentUser.uid,
                source,
                amount: Number(amount),
                date,
                description,
            });
            navigate('/dashboard');
        }
        catch (error) {
            alert('Error adding income: ' + error.message);
        }
    };
    return (_jsxs("div", { className: "p-6 flex flex-col items-center", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Add Income" }), _jsxs("select", { value: source, onChange: (e) => setSource(e.target.value), className: "border rounded-lg p-2 w-72 mb-2", children: [_jsx("option", { value: "", children: "Select Source" }), _jsx("option", { value: "Allowance", children: "Allowance" }), _jsx("option", { value: "Part-time Job", children: "Part-time Job" }), _jsx("option", { value: "Freelance", children: "Freelance" }), _jsx("option", { value: "Gift", children: "Gift" }), _jsx("option", { value: "Scholarship", children: "Scholarship" }), _jsx("option", { value: "Other", children: "Other" })] }), _jsx("input", { type: "number", placeholder: "Amount (KSH)", className: "border rounded-lg p-2 w-72 mb-2", value: amount, onChange: (e) => setAmount(e.target.value) }), _jsx("input", { type: "text", placeholder: "Description (optional)", className: "border rounded-lg p-2 w-72 mb-2", value: description, onChange: (e) => setDescription(e.target.value) }), _jsx("input", { type: "date", className: "border rounded-lg p-2 w-72 mb-4", value: date, onChange: (e) => setDate(e.target.value) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleSave, className: "bg-green-600 text-white px-6 py-2 rounded-lg", children: "Save Income" }), _jsx("button", { onClick: () => navigate('/dashboard'), className: "bg-gray-400 text-white px-6 py-2 rounded-lg", children: "Cancel" })] })] }));
}
