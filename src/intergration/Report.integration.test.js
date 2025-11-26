import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import Report from '../Pages/Report';
import { useAuth } from '../hooks/useAuth';
import { getUserExpenses } from '../services/database';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
vi.mock('../../src/hooks/useAuth');
vi.mock('../../src/services/database');
describe('Report Integration', () => {
    it('fetches expenses and displays summary', async () => {
        useAuth.mockReturnValue({ currentUser: { uid: 'u1' } });
        getUserExpenses.mockResolvedValue([
            { category: 'Food', amount: 200, date: new Date().toISOString() },
            { category: 'Transport', amount: 100, date: new Date().toISOString() }
        ]);
        render(_jsx(MemoryRouter, { children: _jsx(Report, {}) }));
        await waitFor(() => {
            expect(screen.getByText(/Total Expenses/i)).toBeInTheDocument();
            expect(screen.getByText(/KSH 300.00/i)).toBeInTheDocument();
        });
    });
});
