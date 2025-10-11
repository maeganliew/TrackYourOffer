import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../src/pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/api/axios';
import toast from 'react-hot-toast';

jest.mock('../../src/context/AuthContext');
jest.mock('../../src/api/axios');
jest.mock('react-hot-toast');

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  it('renders email and password inputs and submit button', () => {
    setup();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    setup();
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('toggles password visibility', () => {
    setup();
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: '' });

    // initially password type
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submits the form successfully', async () => {
    setup();
    (api.post as jest.Mock).mockResolvedValue({
      data: { token: 'fake-token', user: { id: '1', email: 'test@example.com' } },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockLogin).toHaveBeenCalledWith('fake-token', { id: '1', email: 'test@example.com' });
      expect(toast.success).toHaveBeenCalledWith('Welcome back!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error toast on API failure', async () => {
    setup();
    (api.post as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
      isAxiosError: true,
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
      expect(mockLogin).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
