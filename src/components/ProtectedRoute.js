import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { children: "Loading..." }) }));
    }
    if (!currentUser) {
        return _jsx(Navigate, { to: "/login" });
    }
    return _jsx(_Fragment, { children: children });
}
