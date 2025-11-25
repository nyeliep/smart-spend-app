import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddExpense from '../AddExpense';
import { useAuth } from '../../hooks/useAuth';
import { addExpense } from '../../services/database';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../hooks/useAuth');
vi.mock('../../services/database', () => ({
  addExpense: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AddExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all input fields and buttons', () => {
    (useAuth as any).mockReturnValue({ currentUser: { uid: '123' } });

    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    expect(screen.getByText(/Add Expense/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Expense/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('calls addExpense and navigates on successful save', async () => {
    const mockUser = { uid: '123' };
    (useAuth as any).mockReturnValue({ currentUser: mockUser });
    (addExpense as any).mockResolvedValue({});

    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '200' } });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: 'Lunch' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Expense/i }));

    await waitFor(() => {
      expect(addExpense).toHaveBeenCalledWith(expect.objectContaining({
        userId: mockUser.uid,
        category: 'Food',
        amount: 200,
        description: 'Lunch',
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('alerts and navigates to login if no user', async () => {
    (useAuth as any).mockReturnValue({ currentUser: null });
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Save Expense/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('You must be logged in to add expenses');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('alerts when required fields are missing or amount is invalid', async () => {
    const mockUser = { uid: '123' };
    (useAuth as any).mockReturnValue({ currentUser: mockUser });
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    // Missing category
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '200' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Expense/i }));
    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');

    // Amount <= 0
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Expense/i }));
    expect(window.alert).toHaveBeenCalledWith('Amount must be greater than 0');
  });

  it('navigates to dashboard on cancel', () => {
    (useAuth as any).mockReturnValue({ currentUser: { uid: '123' } });

    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
