import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { addExpense } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
export default function AddExpense() {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const handleSave = async () => {
        if (!currentUser) {
            alert('You must be logged in to add expenses');
            navigate('/login');
            return;
        }
        if (!category || !amount || !date) {
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
            await addExpense({
                userId: currentUser.uid,
                category,
                amount: Number(amount),
                date,
                description: description || category,
            });
            navigate('/dashboard');
        }
        catch (error) {
            alert('Error adding expense: ' + error.message);
        }
    };
    return (_jsxs("div", { className: "p-6 flex flex-col items-center", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Add Expense" }), _jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "border rounded-lg p-2 w-72 mb-2", children: [_jsx("option", { value: "", children: "Select Category" }), _jsx("option", { value: "Food", children: "Food" }), _jsx("option", { value: "Transport", children: "Transport" }), _jsx("option", { value: "Stationery", children: "Stationery" }), _jsx("option", { value: "Entertainment", children: "Entertainment" }), _jsx("option", { value: "Shopping", children: "Shopping" }), _jsx("option", { value: "Bills", children: "Bills" }), _jsx("option", { value: "Other", children: "Other" })] }), _jsx("input", { type: "number", placeholder: "Amount (KSH)", className: "border rounded-lg p-2 w-72 mb-2", value: amount, onChange: (e) => setAmount(e.target.value) }), _jsx("input", { type: "text", placeholder: "Description (optional)", className: "border rounded-lg p-2 w-72 mb-2", value: description, onChange: (e) => setDescription(e.target.value) }), _jsx("input", { type: "date", className: "border rounded-lg p-2 w-72 mb-4", value: date, onChange: (e) => setDate(e.target.value) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: handleSave, className: "bg-primary text-white px-6 py-2 rounded-lg", children: "Save Expense" }), _jsx("button", { onClick: () => navigate('/dashboard'), className: "bg-gray-400 text-white px-6 py-2 rounded-lg", children: "Cancel" })] })] }));
}
