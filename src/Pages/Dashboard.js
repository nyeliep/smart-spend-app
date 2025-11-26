import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { subscribeToExpenses, subscribeToIncome } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/auth';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d084d0', '#ffb3ba'];
function generateExpensePieData(expenses) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const categoryMap = {};
    expenses.forEach(exp => {
        const date = new Date(exp.date);
        if (date.getMonth() === month && date.getFullYear() === year) {
            categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
        }
    });
    return Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount,
    }));
}
export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
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
        if (!currentUser || !currentUser.uid) {
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
        }
        catch {
            void 0;
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { children: "Loading..." }) }));
    }
    const todayExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        const today = new Date();
        return expDate.toDateString() === today.toDateString();
    });
    return (_jsxs("div", { className: "p-4 sm:p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h2", { className: "text-lg font-semibold", children: ["Hi ", userProfile?.name || currentUser?.displayName || currentUser?.email || 'User'] }), _jsxs("div", { className: " flex flex-col sm:flex-row items-end sm:items-center gap-2", children: [_jsxs("div", { className: "hidden sm:flex gap-2", children: [_jsx("button", { onClick: () => navigate('/add-expense'), className: "bg-primary text-white px-3 py-1 rounded-lg", children: "+ Expense" }), _jsx("button", { onClick: () => navigate('/add-income'), className: "bg-green-600 text-white px-3 py-1 rounded-lg", children: "+ Income" }), _jsx("button", { onClick: handleLogout, className: "bg-red-600 text-white px-3 py-1 rounded-lg", children: "Logout" })] }), _jsxs("div", { className: "sm:hidden relative", children: [_jsx("button", { className: "p-2 bg-gray-200 rounded-lg", onClick: () => setMenuOpen(!menuOpen), children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M4 6h16M4 12h16M4 18h16" }) }) }), menuOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg flex flex-col gap-1 p-2 z-50", children: [_jsx("button", { onClick: () => { navigate('/add-expense'); setMenuOpen(false); }, className: "bg-primary text-white px-3 py-1 rounded-lg w-full text-left", children: "+ Expense" }), _jsx("button", { onClick: () => { navigate('/add-income'); setMenuOpen(false); }, className: "bg-green-600 text-white px-3 py-1 rounded-lg w-full text-left", children: "+ Income" }), _jsx("button", { onClick: () => { navigate('/report'); setMenuOpen(false); }, className: "bg-blue-600 text-white px-3 py-1 rounded-lg w-full text-left", children: "View Report" }), _jsx("button", { onClick: () => { handleLogout(); setMenuOpen(false); }, className: "bg-red-600 text-white px-3 py-1 rounded-lg w-full text-left", children: "Logout" })] }))] })] })] }), _jsxs("div", { className: " grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "bg-blue-100 shadow p-4 rounded-xl text-center", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Balance" }), _jsxs("p", { className: "text-xl font-semibold", children: ["ksh ", balance.toFixed(2)] })] }), _jsxs("div", { className: "bg-green-100 shadow p-4 rounded-xl text-center", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Total income" }), _jsxs("p", { className: "font-semibold", children: ["ksh ", totalIncome.toFixed(2)] })] }), _jsxs("div", { className: "bg-yellow-100 shadow p-4 rounded-xl text-center", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Total expenses" }), _jsxs("p", { className: "font-semibold", children: ["ksh ", totalExpenses.toFixed(2)] })] })] }), _jsx("h3", { className: "font-medium mb-2", children: "Today's Expenses" }), _jsx("div", { className: "bg-white shadow p-4 rounded-xl max-h-64 overflow-y-auto mb-6", children: todayExpenses.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "No expenses today" })) : (todayExpenses.map((exp) => (_jsxs("div", { className: "flex justify-between text-sm py-1 border-b last:border-b-0", children: [_jsx("span", { className: "text-gray-700", children: exp.category }), _jsxs("span", { className: "text-gray-800 font-medium", children: ["ksh ", exp.amount.toFixed(2)] })] }, exp.id)))) }), _jsx("h3", { className: "font-medium mb-2", children: "Recent Income" }), _jsx("div", { className: "bg-white shadow p-4 rounded-xl max-h-64 overflow-y-auto", children: income.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "No income recorded" })) : (income.slice(0, 5).map((inc) => (_jsxs("div", { className: "flex justify-between text-sm py-1 border-b last:border-b-0", children: [_jsx("span", { className: "text-gray-700", children: inc.source }), _jsxs("span", { className: "text-green-600 font-medium", children: ["+ksh ", inc.amount.toFixed(2)] })] }, inc.id)))) }), _jsx("h3", { className: "font-medium mb-2 mt-6", children: "Student Tip for Budgeting" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4", children: [
                    budgetingTips[currentTipIndex],
                    budgetingTips[(currentTipIndex + 1) % budgetingTips.length]
                ].map(tip => (_jsx("div", { className: `${tip.color} p-6 rounded-xl shadow-md flex items-center justify-center`, children: _jsx("p", { className: "text-gray-800 text-sm text-center", children: tip.text }) }, tip.id))) }), _jsx("h3", { className: "font-medium mb-2 mt-6", children: "Monthly Report Preview" }), _jsxs("div", { className: "bg-white shadow p-4 rounded-xl", children: [_jsx("p", { className: "text-gray-500 text-sm mb-2 text-center", children: "Distribution of your expenses by category this month" }), _jsx("div", { className: "w-full h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: generateExpensePieData(expenses), dataKey: "amount", nameKey: "category", cx: "50%", cy: "50%", outerRadius: 80, fill: "#8884d8", label: true, children: generateExpensePieData(expenses).map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }) }), _jsx("div", { className: "mt-4 text-center", children: _jsx("button", { onClick: () => navigate('/report'), className: "bg-blue-600 text-white px-4 py-2 rounded-lg", children: "View Full Report" }) })] })] }));
}
