import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc, orderBy, onSnapshot } from 'firebase/firestore';
export const addExpense = async (expense) => {
    const docRef = await addDoc(collection(db, 'expenses'), expense);
    return docRef.id;
};
export const getUserExpenses = async (userId) => {
    const q = query(collection(db, 'expenses'), where('userId', '==', userId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const expenses = [];
    querySnapshot.forEach((doc) => {
        expenses.push({ id: doc.id, ...doc.data() });
    });
    return expenses;
};
export const deleteExpense = async (expenseId) => {
    await deleteDoc(doc(db, 'expenses', expenseId));
};
export const updateExpense = async (expenseId, expense) => {
    const expenseRef = doc(db, 'expenses', expenseId);
    await updateDoc(expenseRef, expense);
};
export const addIncome = async (income) => {
    const docRef = await addDoc(collection(db, 'income'), income);
    return docRef.id;
};
export const getUserIncome = async (userId) => {
    const q = query(collection(db, 'income'), where('userId', '==', userId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const income = [];
    querySnapshot.forEach((doc) => {
        income.push({ id: doc.id, ...doc.data() });
    });
    return income;
};
export const deleteIncome = async (incomeId) => {
    await deleteDoc(doc(db, 'income', incomeId));
};
export const updateIncome = async (incomeId, income) => {
    const incomeRef = doc(db, 'income', incomeId);
    await updateDoc(incomeRef, income);
};
export const subscribeToExpenses = (userId, callback) => {
    const q = query(collection(db, 'expenses'), where('userId', '==', userId), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const expenses = [];
        snapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
        });
        callback(expenses);
    }, () => {
        callback([]);
    });
};
export const subscribeToIncome = (userId, callback) => {
    const q = query(collection(db, 'income'), where('userId', '==', userId), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const income = [];
        snapshot.forEach((doc) => {
            income.push({ id: doc.id, ...doc.data() });
        });
        callback(income);
    }, () => {
        callback([]);
    });
};
