import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc, orderBy, onSnapshot } from 'firebase/firestore';
import type { Expense, Income } from '../types';
import type { Unsubscribe } from 'firebase/firestore';

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'expenses'), expense);
  return docRef.id;
};

export const getUserExpenses = async (userId: string): Promise<Expense[]> => {
  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const expenses: Expense[] = [];
  querySnapshot.forEach((doc) => {
    expenses.push({ id: doc.id, ...doc.data() } as Expense);
  });
  return expenses;
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  await deleteDoc(doc(db, 'expenses', expenseId));
};

export const updateExpense = async (expenseId: string, expense: Partial<Expense>): Promise<void> => {
  const expenseRef = doc(db, 'expenses', expenseId);
  await updateDoc(expenseRef, expense);
};

export const addIncome = async (income: Omit<Income, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'income'), income);
  return docRef.id;
};

export const getUserIncome = async (userId: string): Promise<Income[]> => {
  const q = query(
    collection(db, 'income'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const income: Income[] = [];
  querySnapshot.forEach((doc) => {
    income.push({ id: doc.id, ...doc.data() } as Income);
  });
  return income;
};

export const deleteIncome = async (incomeId: string): Promise<void> => {
  await deleteDoc(doc(db, 'income', incomeId));
};

export const updateIncome = async (incomeId: string, income: Partial<Income>): Promise<void> => {
  const incomeRef = doc(db, 'income', incomeId);
  await updateDoc(incomeRef, income);
};

export const subscribeToExpenses = (
  userId: string,
  callback: (expenses: Expense[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const expenses: Expense[] = [];
    snapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() } as Expense);
    });
    callback(expenses);
  }, () => {
    callback([]);
  });
};

export const subscribeToIncome = (
  userId: string,
  callback: (income: Income[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, 'income'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const income: Income[] = [];
    snapshot.forEach((doc) => {
      income.push({ id: doc.id, ...doc.data() } as Income);
    });
    callback(income);
  }, () => {
    callback([]);
  });
};