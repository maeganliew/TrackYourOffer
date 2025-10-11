import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Layout from '../../src/components/Layout';
import { useAuth } from '../../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';

// Mock useAuth
jest.mock('../../src/context/AuthContext');
jest.mock('react-hot-toast');

const mockLogout = jest.fn();
const mockNavigate = jest.fn();

// Mock useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'John Doe', email: 'john@example.com' },
      logout: mockLogout,
    });
  });

  it('renders children and navigation', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Child Content</div>
        </Layout>
      </MemoryRouter>
    );

    // Children
    expect(screen.getByText('Child Content')).toBeInTheDocument();

    // User info
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();

    // Navigation links
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('calls logout and navigates when logout button is clicked', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Child Content</div>
        </Layout>
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /log out/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
