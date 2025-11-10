import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function AddExpense() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!category || !amount || !date) {
      alert('All fields are required');
      return;
    }
    await addDoc(collection(db, 'expenses'), {
      category,
      amount: Number(amount),
      date,
    });
    navigate('/dashboard');
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-lg p-2 w-72 mb-2"
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Stationery">Stationery</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        className="border rounded-lg p-2 w-72 mb-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="date"
        className="border rounded-lg p-2 w-72 mb-4"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-primary text-white px-6 py-2 rounded-lg w-72"
      >
        Save
      </button>
    </div>
  );
}
