import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../../src/Pages/Dashboard';
import { useAuth } from '../../src/hooks/useAuth';
import { logoutUser } from '../../src/services/auth';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { act } from '@testing-library/react';
vi.mock('../hooks/useAuth');
const mockedUseAuth = vi.mocked(useAuth, true);
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
vi.mock('../services/database', () => ({
    subscribeToExpenses: vi.fn((_uid, cb) => {
        cb([{ id: 'e1', category: 'Food', amount: 100, date: new Date().toISOString() }]);
        return () => { };
    }),
    subscribeToIncome: vi.fn((_uid, cb) => {
        cb([{ id: 'i1', source: 'Job', amount: 500, date: new Date().toISOString() }]);
        return () => { };
    }),
}));
vi.mock('../services/auth', () => ({
    logoutUser: vi.fn(() => Promise.resolve()),
}));
describe('Dashboard Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseAuth.mockReturnValue({
            currentUser: { uid: '123', displayName: 'John Doe', email: 'john@example.com' },
            userProfile: { name: 'John' },
            loading: false,
        });
    });
    it('renders dashboard for logged-in user', async () => {
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
        const logoutButton = screen.getByText(/logout/i);
        await act(async () => {
            fireEvent.click(logoutButton);
        });
        await waitFor(() => {
            expect(vi.mocked(logoutUser, true)).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});
