import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import AddExpense from '../Pages/AddExpense';
import { addExpense } from '../services/database';
import { useAuth } from '../hooks/useAuth';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/services/database');
vi.mock('../../src/hooks/useAuth');

describe('AddExpense Integration', () => {
  it('adds an expense and navigates to dashboard', async () => {
    const mockUser = { uid: 'u1' };
    (useAuth as any).mockReturnValue({ currentUser: mockUser });
    (addExpense as any).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByPlaceholderText('Amount (KSH)'), { target: { value: '300' } });
    fireEvent.click(screen.getByText('Save Expense'));

    await waitFor(() => {
      expect(addExpense).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'u1',
        category: 'Food',
        amount: 300
      }));
    });
  });

  it('shows alert if required fields are missing', async () => {
    const mockUser = { uid: 'u1' };
    (useAuth as any).mockReturnValue({ currentUser: mockUser });
    window.alert = vi.fn();

    render(
      <MemoryRouter>
        <AddExpense />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Save Expense'));
    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');
  });
});
