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

    if (!currentUser?.uid) return; 

    try {
      await addExpense({
        userId: currentUser.uid,
        category,
        amount: Number(amount),
        date,
        description: description || category,
      });
      navigate('/dashboard');
    } catch (error) {
      alert('Error adding expense: ' + (error as Error).message);
    }
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
        <option value="Entertainment">Entertainment</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="number"
        placeholder="Amount (KSH)"
        className="border rounded-lg p-2 w-72 mb-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        className="border rounded-lg p-2 w-72 mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        className="border rounded-lg p-2 w-72 mb-4"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Save Expense
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-400 text-white px-6 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}