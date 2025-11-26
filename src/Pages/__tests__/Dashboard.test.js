import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { useAuth } from '../../hooks/useAuth';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
vi.mock('../../hooks/useAuth');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
vi.mock('../../services/database', () => {
    return {
        subscribeToExpenses: vi.fn((_uid, cb) => {
            cb([{ id: 'e1', category: 'Food', amount: 100, date: new Date().toISOString() }]);
            return () => { };
        }),
        subscribeToIncome: vi.fn((_uid, cb) => {
            cb([{ id: 'i1', source: 'Job', amount: 500, date: new Date().toISOString() }]);
            return () => { };
        }),
    };
});
vi.mock('../../services/auth', () => {
    return {
        logoutUser: vi.fn(() => Promise.resolve()),
    };
});
describe('Dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({
            currentUser: { uid: '123', displayName: 'John Doe', email: 'john@example.com' },
            userProfile: { name: 'John' },
        });
    });
    it('renders balance, totals, and lists', async () => {
        render(_jsx(MemoryRouter, { children: _jsx(Dashboard, {}) }));
        await waitFor(() => {
            expect(screen.getByText(/balance/i)).toBeInTheDocument();
            expect(screen.getByText(/total income/i)).toBeInTheDocument();
            expect(screen.getByText(/total expenses/i)).toBeInTheDocument();
            expect(screen.getByText(/food/i)).toBeInTheDocument();
            expect(screen.getByText(/\+ksh 500/i)).toBeInTheDocument();
        });
    });
    it('handles logout', async () => {
        render(_jsx(MemoryRouter, { children: _jsx(Dashboard, {}) }));
        await waitFor(async () => {
            const logoutButton = screen.getByText(/logout/i);
            fireEvent.click(logoutButton);
            // logoutUser is automatically mocked
            const { logoutUser } = await import('../../services/auth');
            expect(logoutUser).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
