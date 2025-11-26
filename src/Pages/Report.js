import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getUserExpenses } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d084d0', '#ffb3ba'];
export default function Report() {
    const [dailyData, setDailyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!currentUser?.uid)
                    return;
                const expenses = await getUserExpenses(currentUser.uid);
                const today = new Date();
                const lastWeek = new Date(today);
                lastWeek.setDate(today.getDate() - 6);
                const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dailyTotals = {};
                for (let i = 0; i < 7; i++) {
                    const date = new Date(lastWeek);
                    date.setDate(lastWeek.getDate() + i);
                    const dayName = weekDays[date.getDay()];
                    dailyTotals[dayName] = 0;
                }
                expenses.forEach((expense) => {
                    const expDate = new Date(expense.date);
                    if (expDate >= lastWeek && expDate <= today) {
                        const dayName = weekDays[expDate.getDay()];
                        dailyTotals[dayName] = (dailyTotals[dayName] || 0) + expense.amount;
                    }
                });
                const daily = Object.entries(dailyTotals).map(([day, amount]) => ({
                    day,
                    amount: Number(amount.toFixed(2))
                }));
                const categoryTotals = {};
                expenses.forEach((expense) => {
                    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
                });
                const categories = Object.entries(categoryTotals).map(([name, value]) => ({
                    name,
                    value: Number(value.toFixed(2))
                }));
                setDailyData(daily);
                setCategoryData(categories);
            }
            catch {
                void 0;
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser, navigate]);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { children: "Loading report..." }) }));
    }
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Expense Reports" }), _jsx("button", { onClick: () => navigate('/dashboard'), className: "bg-gray-500 text-white px-4 py-2 rounded-lg", children: "Back to Dashboard" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white shadow rounded-xl p-4", children: [_jsx("h3", { className: "text-md font-semibold mb-4", children: "Daily Expenses (Last 7 Days)" }), dailyData.every(d => d.amount === 0) ? (_jsx("p", { className: "text-gray-500 text-center py-8", children: "No expenses in the last 7 days" })) : (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: dailyData, children: [_jsx(XAxis, { dataKey: "day" }), _jsx(YAxis, {}), _jsx(Tooltip, { formatter: (value) => `KSH ${value}` }), _jsx(Bar, { dataKey: "amount", fill: "#2ECC71" })] }) }))] }), _jsxs("div", { className: "bg-white shadow rounded-xl p-4", children: [_jsx("h3", { className: "text-md font-semibold mb-4", children: "Expenses by Category" }), categoryData.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-8", children: "No expenses recorded yet" })) : (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: categoryData, cx: "50%", cy: "50%", labelLine: false, label: (entry) => `${entry.name} ${((entry.percent || 0) * 100).toFixed(0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: categoryData.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => `KSH ${value}` }), _jsx(Legend, {})] }) }))] })] }), _jsxs("div", { className: "mt-6 bg-white shadow rounded-xl p-4", children: [_jsx("h3", { className: "text-md font-semibold mb-4", children: "Summary Statistics" }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Total Expenses" }), _jsxs("p", { className: "text-xl font-semibold", children: ["KSH ", categoryData.reduce((sum, cat) => sum + cat.value, 0).toFixed(2)] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Categories" }), _jsx("p", { className: "text-xl font-semibold", children: categoryData.length })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-500 text-sm", children: "Daily Average" }), _jsxs("p", { className: "text-xl font-semibold", children: ["KSH ", (dailyData.reduce((sum, day) => sum + day.amount, 0) / 7).toFixed(2)] })] })] })] })] }));
}
