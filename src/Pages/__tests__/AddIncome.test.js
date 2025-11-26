import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddIncome from '../AddIncome';
import { useAuth } from '../../hooks/useAuth';
import { addIncome } from '../../services/database';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
vi.mock('../../hooks/useAuth');
vi.mock('../../services/database', () => ({
    addIncome: vi.fn(),
}));
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
describe('AddIncome', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('renders all input fields and buttons', () => {
        useAuth.mockReturnValue({ currentUser: { uid: '123' } });
        render(_jsx(MemoryRouter, { children: _jsx(AddIncome, {}) }));
        expect(screen.getByText(/Add Income/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Amount/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Save Income/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
    it('calls addIncome and navigates on successful save', async () => {
        const mockUser = { uid: '123' };
        useAuth.mockReturnValue({ currentUser: mockUser });
        addIncome.mockResolvedValue({});
        render(_jsx(MemoryRouter, { children: _jsx(AddIncome, {}) }));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Allowance' } });
        fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '500' } });
        fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: 'Monthly allowance' } });
        fireEvent.click(screen.getByRole('button', { name: /Save Income/i }));
        await waitFor(() => {
            expect(addIncome).toHaveBeenCalledWith(expect.objectContaining({
                userId: mockUser.uid,
                source: 'Allowance',
                amount: 500,
                description: 'Monthly allowance',
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });
    it('alerts and navigates to login if no user', async () => {
        useAuth.mockReturnValue({ currentUser: null });
        window.alert = vi.fn();
        render(_jsx(MemoryRouter, { children: _jsx(AddIncome, {}) }));
        fireEvent.click(screen.getByRole('button', { name: /Save Income/i }));
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('You must be logged in to add income');
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
    it('alerts when required fields are missing or amount is invalid', async () => {
        const mockUser = { uid: '123' };
        useAuth.mockReturnValue({ currentUser: mockUser });
        window.alert = vi.fn();
        render(_jsx(MemoryRouter, { children: _jsx(AddIncome, {}) }));
        // Missing source
        fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '500' } });
        fireEvent.click(screen.getByRole('button', { name: /Save Income/i }));
        expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');
        // Amount <= 0
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Allowance' } });
        fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '0' } });
        fireEvent.click(screen.getByRole('button', { name: /Save Income/i }));
        expect(window.alert).toHaveBeenCalledWith('Amount must be greater than 0');
    });
    it('navigates to dashboard on cancel', () => {
        useAuth.mockReturnValue({ currentUser: { uid: '123' } });
        render(_jsx(MemoryRouter, { children: _jsx(AddIncome, {}) }));
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
});
