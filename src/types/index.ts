export interface User {
  uid: string;
  email: string;
  name: string;
  createdAt: string;
  monthlyBudget: number;
}

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Income {
  id?: string;
  userId: string;
  amount: number;
  source: string;
  date: string;
  description?: string;
}