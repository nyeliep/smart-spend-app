import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Report from '../Report';
import { useAuth } from '../../hooks/useAuth';
import { getUserExpenses } from '../../services/database';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
vi.mock('../../hooks/useAuth');
vi.mock('../../services/database', () => ({
    getUserExpenses: vi.fn(),
}));
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
describe('Report', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('renders loading initially', () => {
        useAuth.mockReturnValue({ currentUser: { uid: '123' } });
        render(_jsx(MemoryRouter, { children: _jsx(Report, {}) }));
        expect(screen.getByText(/Loading report/i)).toBeInTheDocument();
    });
    it('redirects to login if no user', () => {
        useAuth.mockReturnValue({ currentUser: null });
        render(_jsx(MemoryRouter, { children: _jsx(Report, {}) }));
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
    it('renders charts and summary with mock data', async () => {
        const mockExpenses = [
            { category: 'Food', amount: 100, date: new Date().toISOString() },
            { category: 'Transport', amount: 50, date: new Date().toISOString() },
        ];
        useAuth.mockReturnValue({ currentUser: { uid: '123' } });
        getUserExpenses.mockResolvedValue(mockExpenses);
        render(_jsx(MemoryRouter, { children: _jsx(Report, {}) }));
        await waitFor(() => {
            expect(screen.getByText(/Expense Reports/i)).toBeInTheDocument();
            expect(screen.getByText(/Daily Expenses/i)).toBeInTheDocument();
            expect(screen.getByText(/Expenses by Category/i)).toBeInTheDocument();
            expect(screen.getByText(/Total Expenses/i)).toBeInTheDocument();
            expect(screen.getByText(/Categories/i)).toBeInTheDocument();
            expect(screen.getByText(/Daily Average/i)).toBeInTheDocument();
        });
    });
    it('navigates back to dashboard on button click', async () => {
        useAuth.mockReturnValue({ currentUser: { uid: '123' } });
        getUserExpenses.mockResolvedValue([]);
        render(_jsx(MemoryRouter, { children: _jsx(Report, {}) }));
        await waitFor(() => {
            fireEvent.click(screen.getByText(/Back to Dashboard/i));
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });
    it('displays message when no expenses', async () => {
        useAuth.mockReturnValue({ currentUser: { uid: '123' } });
        getUserExpenses.mockResolvedValue([]);
        render(_jsx(MemoryRouter, { children: _jsx(Report, {}) }));
        await waitFor(() => {
            expect(screen.getByText(/No expenses in the last 7 days/i)).toBeInTheDocument();
            expect(screen.getByText(/No expenses recorded yet/i)).toBeInTheDocument();
        });
    });
});
