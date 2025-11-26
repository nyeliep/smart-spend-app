import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddIncome from '../Pages/AddIncome';
import { addIncome } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import { MemoryRouter } from 'react-router-dom';
vi.mock('../services/database');
vi.mock('../hooks/useAuth');
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});
describe('AddIncome Integration', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            currentUser: { uid: 'u1' },
        });
        addIncome.mockResolvedValue(undefined);
    });
    it('adds an income and navigates to dashboard', async () => {
        render(_jsx(MemoryRouter, { children: _jsx(AddIncome, {}) }));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Allowance' } });
        fireEvent.change(screen.getByPlaceholderText('Amount (KSH)'), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText('Description (optional)'), { target: { value: 'Test Income' } });
        fireEvent.click(screen.getByText('Save Income'));
        await waitFor(() => {
            expect(addIncome).toHaveBeenCalledWith(expect.objectContaining({
                userId: 'u1',
                source: 'Allowance',
                amount: 1000,
                description: 'Test Income',
            }));
        });
        expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
});
