import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Report from './Pages/Report';
import AddExpense from './Pages/AddExpense';
import AddIncome from './Pages/AddIncome';
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/report", element: _jsx(ProtectedRoute, { children: _jsx(Report, {}) }) }), _jsx(Route, { path: "/add-expense", element: _jsx(ProtectedRoute, { children: _jsx(AddExpense, {}) }) }), _jsx(Route, { path: "/add-income", element: _jsx(ProtectedRoute, { children: _jsx(AddIncome, {}) }) })] }) }) }));
}
