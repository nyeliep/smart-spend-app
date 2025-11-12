import { useEffect, useState } from 'react';
import { getUserExpenses } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface DailyData {
  day: string;
  amount: number;
}

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d084d0', '#ffb3ba'];

export default function Report() {
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
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
        const expenses = await getUserExpenses(currentUser.uid);

        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 6);

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyTotals: { [key: string]: number } = {};

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

        const categoryTotals: { [key: string]: number } = {};
        expenses.forEach((expense) => {
          categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const categories = Object.entries(categoryTotals).map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2))
        }));

        setDailyData(daily);
        setCategoryData(categories);
      } catch {
        void 0;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading report...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Expense Reports</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-md font-semibold mb-4">Daily Expenses (Last 7 Days)</h3>
          {dailyData.every(d => d.amount === 0) ? (
            <p className="text-gray-500 text-center py-8">No expenses in the last 7 days</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `KSH ${value}`} />
                <Bar dataKey="amount" fill="#2ECC71" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-md font-semibold mb-4">Expenses by Category</h3>
          {categoryData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${(entry as unknown as CategoryData & { percent?: number }).name} ${(((entry as unknown as CategoryData & { percent?: number }).percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `KSH ${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded-xl p-4">
        <h3 className="text-md font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Total Expenses</p>
            <p className="text-xl font-semibold">
              KSH {categoryData.reduce((sum, cat) => sum + cat.value, 0).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Categories</p>
            <p className="text-xl font-semibold">{categoryData.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Daily Average</p>
            <p className="text-xl font-semibold">
              KSH {(dailyData.reduce((sum, day) => sum + day.amount, 0) / 7).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}