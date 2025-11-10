import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Expense {
  category: string;
  amount: number;
  date: string;
}

export default function Report() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'expenses'));
      const expenses: Expense[] = [];
      querySnapshot.forEach((doc) => expenses.push(doc.data() as Expense));

      // group by day (mock data structure)
      const grouped = [
        { day: 'Mon', amount: 70 },
        { day: 'Tue', amount: 20 },
        { day: 'Wed', amount: 64 },
        { day: 'Thu', amount: 48 },
        { day: 'Fri', amount: 31 },
        { day: 'Sat', amount: 20 },
        { day: 'Sun', amount: 15 },
      ];

      setData(grouped);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-center mb-6">Daily Expenses</h2>
      <div className="bg-white shadow rounded-xl p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#2ECC71" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
