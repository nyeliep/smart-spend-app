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

    try {
      await addIncome({
        userId: currentUser.uid,
        source,
        amount: Number(amount),
        date,
        description,
      });
      navigate('/dashboard');
    } catch (error) {
      alert('Error adding income: ' + (error as Error).message);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Add Income</h2>
      <select
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="border rounded-lg p-2 w-72 mb-2"
      >
        <option value="">Select Source</option>
        <option value="Allowance">Allowance</option>
        <option value="Part-time Job">Part-time Job</option>
        <option value="Freelance">Freelance</option>
        <option value="Gift">Gift</option>
        <option value="Scholarship">Scholarship</option>
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
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Save Income
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