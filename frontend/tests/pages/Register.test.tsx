import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../../src/pages/Register';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/api/axios';
import toast from 'react-hot-toast';
import userEvent from '@testing-library/user-event';
import { setAuth } from '../../src/utils/auth';

// Mocks
jest.mock('../../src/context/AuthContext');
jest.mock('../../src/api/axios');

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
    Toaster: () => <div />,
  },
}));

const mockSetAuth = jest.fn();
jest.mock('../../src/utils/auth', () => ({
  setAuth: (...args: Parameters<typeof setAuth>) => mockSetAuth(...args),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({});
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

  it('renders all inputs and button', () => {
    setup();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows error toast if passwords do not match', async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), '1234');
    await user.type(screen.getByLabelText(/confirm password/i), '5678');

    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
        expect(api.post).not.toHaveBeenCalled();
    });
  });

  it('submits form successfully', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: { token: 'fake-token', user: { id: '1', email: 'test@example.com' } },
    });

    setup();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockSetAuth).toHaveBeenCalledWith('fake-token', { id: '1', email: 'test@example.com' });
      expect(toast.success).toHaveBeenCalledWith('Account created successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('toggles password visibility', () => {
    setup();
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const passwordToggle = passwordInput.nextElementSibling as HTMLElement;
    const confirmToggle = confirmInput.nextElementSibling as HTMLElement;

    // initial type
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    fireEvent.click(passwordToggle);
    fireEvent.click(confirmToggle);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmInput).toHaveAttribute('type', 'text');
  });
});
