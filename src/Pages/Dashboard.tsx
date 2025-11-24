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
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const budgetingTips = [
    { id: 1, text: "💡 Track your expenses daily to see where your money goes.", color: "bg-blue-100" },
    { id: 2, text: "📊 Set a weekly budget and stick to it.", color: "bg-green-100" },
    { id: 3, text: "🛑 Prioritize needs over wants to save money.", color: "bg-yellow-100" },
    { id: 4, text: "📂 Use envelopes or separate accounts for different categories.", color: "bg-purple-100" },
    { id: 5, text: "💰 Save at least 10% of any income you get.", color: "bg-pink-100" },
  ];

  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTipIndex(prevIndex => (prevIndex + 2) % budgetingTips.length); 

  }, 10000); 

  return () => clearInterval(interval);
}, []);

  
 

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
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
  Hi {userProfile?.name || currentUser?.displayName || currentUser?.email || 'User'}
</h2>


        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <div className="hidden sm:flex gap-2">
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

          {/* Mobile hamburger */}
          <div className="sm:hidden relative">
            <button
              className="p-2 bg-gray-200 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg flex flex-col gap-1 p-2 z-50">
                <button
                  onClick={() => { navigate('/add-expense'); setMenuOpen(false); }}
                  className="bg-primary text-white px-3 py-1 rounded-lg w-full text-left"
                >
                  + Expense
                </button>
                <button
                  onClick={() => { navigate('/add-income'); setMenuOpen(false); }}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg w-full text-left"
                >
                  + Income
                </button>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Balance & totals grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded-xl text-center">
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

      {/* Today's Expenses */}
      <h3 className="font-medium mb-2">Today's Expenses</h3>
      <div className="bg-white shadow p-4 rounded-xl max-h-64 overflow-y-auto mb-6">
        {todayExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses today</p>
        ) : (
          todayExpenses.map((exp) => (
            <div key={exp.id} className="flex justify-between text-sm py-1 border-b last:border-b-0">
              <span className="text-gray-700">{exp.category}</span>
              <span className="text-gray-800 font-medium">ksh {exp.amount.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      {/* Recent Income */}
      <h3 className="font-medium mb-2">Recent Income</h3>
      <div className="bg-white shadow p-4 rounded-xl max-h-64 overflow-y-auto">
        {income.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No income recorded</p>
        ) : (
          income.slice(0, 5).map((inc) => (
            <div key={inc.id} className="flex justify-between text-sm py-1 border-b last:border-b-0">
              <span className="text-gray-700">{inc.source}</span>
              <span className="text-green-600 font-medium">+ksh {inc.amount.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

   {/* Rotating Student Budgeting Tip */}
      <h3 className="font-medium mb-2 mt-6">Student Tip for Budgeting</h3>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
  {[
    budgetingTips[currentTipIndex],
    budgetingTips[(currentTipIndex + 1) % budgetingTips.length]
  ].map(tip => (
    <div
      key={tip.id}
      className={`${tip.color} p-6 rounded-xl shadow-md flex items-center justify-center`}
    >
      <p className="text-gray-800 text-sm text-center">{tip.text}</p>
    </div>
  ))}
</div>


    </div>
  );
}
