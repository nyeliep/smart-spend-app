import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balance, setBalance] = useState(2500);
  const [totalIncome, setTotalIncome] = useState(500);
  const [totalExpenses, setTotalExpenses] = useState(500);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      const querySnapshot = await getDocs(collection(db, 'expenses'));
      const expenseList: Expense[] = [];
      let total = 0;
      querySnapshot.forEach((doc) => {
        expenseList.push({ id: doc.id, ...doc.data() } as Expense);
        total += doc.data().amount;
      });
      setExpenses(expenseList);
      setTotalExpenses(total);
      setBalance(totalIncome - total);
    };
    fetchExpenses();
  }, [totalIncome]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Hi Clark!</h2>
        <button
          onClick={() => navigate('/add-expense')}
          className="bg-primary text-white px-3 py-1 rounded-lg"
        >
          + Add
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-3 bg-white shadow p-4 rounded-xl text-center">
          <p className="text-gray-500 text-sm">Balance</p>
          <p className="text-xl font-semibold">ksh {balance}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <p className="text-gray-500 text-sm">Total income</p>
          <p className="font-semibold">ksh {totalIncome}</p>
          <button
            onClick={() => setTotalIncome(prev => prev + 100)}
            className="text-xs text-primary mt-2"
          >
            Update Income
          </button>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <p className="text-gray-500 text-sm">Total expenses</p>
          <p className="font-semibold">ksh {totalExpenses}</p>
        </div>
      </div>

      <h3 className="font-medium mb-2">Today</h3>
      <div className="bg-white shadow p-4 rounded-xl">
        {expenses.map((exp) => (
          <div key={exp.id} className="flex justify-between text-sm py-1 border-b">
            <span className="text-gray-700">{exp.category}</span>
            <span className="text-gray-800 font-medium">ksh {exp.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
