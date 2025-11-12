import { useEffect, useState } from 'react';
import { subscribeToExpenses, subscribeToIncome } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import type { Expense, Income } from '../types';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/auth';

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    let currentExpenseTotal = 0;
    let currentIncomeTotal = 0;

    const unsubscribeExpenses = subscribeToExpenses(currentUser.uid, (expenseList) => {
      setExpenses(expenseList);
      currentExpenseTotal = expenseList.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalExpenses(currentExpenseTotal);
      setBalance(currentIncomeTotal - currentExpenseTotal);
      setLoading(false);
    });

    const unsubscribeIncome = subscribeToIncome(currentUser.uid, (incomeList) => {
      setIncome(incomeList);
      currentIncomeTotal = incomeList.reduce((sum, inc) => sum + inc.amount, 0);
      setTotalIncome(currentIncomeTotal);
      setBalance(currentIncomeTotal - currentExpenseTotal);
      setLoading(false);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeIncome();
    };
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch {
      void 0;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const todayExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const today = new Date();
    return expDate.toDateString() === today.toDateString();
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Hi {userProfile?.name || 'User'}!</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/add-expense')}
            className="bg-primary text-white px-3 py-1 rounded-lg"
          >
            + Expense
          </button>
          <button
            onClick={() => navigate('/add-income')}
            className="bg-green-600 text-white px-3 py-1 rounded-lg"
          >
            + Income
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-3 bg-white shadow p-4 rounded-xl text-center">
          <p className="text-gray-500 text-sm">Balance</p>
          <p className="text-xl font-semibold">ksh {balance.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <p className="text-gray-500 text-sm">Total income</p>
          <p className="font-semibold">ksh {totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <p className="text-gray-500 text-sm">Total expenses</p>
          <p className="font-semibold">ksh {totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      <h3 className="font-medium mb-2">Today's Expenses</h3>
      <div className="bg-white shadow p-4 rounded-xl">
        {todayExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses today</p>
        ) : (
          todayExpenses.map((exp) => (
            <div key={exp.id} className="flex justify-between text-sm py-1 border-b">
              <span className="text-gray-700">{exp.category}</span>
              <span className="text-gray-800 font-medium">ksh {exp.amount.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <h3 className="font-medium mb-2 mt-6">Recent Income</h3>
      <div className="bg-white shadow p-4 rounded-xl">
        {income.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No income recorded</p>
        ) : (
          income.slice(0, 5).map((inc) => (
            <div key={inc.id} className="flex justify-between text-sm py-1 border-b">
              <span className="text-gray-700">{inc.source}</span>
              <span className="text-green-600 font-medium">+ksh {inc.amount.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}