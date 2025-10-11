import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../../src/pages/Profile';
import ProfileForm from '../../src/components/ProfileForm';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/api/axios';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../../src/context/AuthContext');
jest.mock('../../src/api/axios');
jest.mock('../../src/components/ProfileForm', () => (props: any) => {
  return (
    <div data-testid="profile-form">
      <button
        onClick={() => props.onUpdateUsername('newusername')}
        data-testid="update-username-btn"
      >
        Update Username
      </button>
      <button
        onClick={() => props.onUpdatePassword('oldpass', 'newpass')}
        data-testid="update-password-btn"
      >
        Update Password
      </button>
      {props.isLoading && <span data-testid="loading">Loading...</span>}
    </div>
  );
});
jest.mock('react-hot-toast');

const mockLogout = jest.fn();
const mockUpdateUser = jest.fn();

describe('Profile Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', username: 'olduser', email: 'test@example.com' },
      updateUser: mockUpdateUser,
      logout: mockLogout,
    });
    jest.clearAllMocks();
  });

  const setup = () => render(<Profile />);

  it('renders profile heading and description', () => {
    setup();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/manage your account settings/i)).toBeInTheDocument();
    expect(screen.getByTestId('profile-form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('handles username update', async () => {
    (api.patch as jest.Mock).mockResolvedValue({});

    setup();
    fireEvent.click(screen.getByTestId('update-username-btn'));

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith('/user/username', { username: 'newusername' });
      expect(mockUpdateUser).toHaveBeenCalledWith({ id: '1', username: 'newusername', email: 'test@example.com' });
      expect(toast.success).toHaveBeenCalledWith('Username updated!');
    });
  });

  it('handles password update', async () => {
    (api.patch as jest.Mock).mockResolvedValue({});

    setup();
    fireEvent.click(screen.getByTestId('update-password-btn'));

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith('/user/changePassword', {
        currentPassword: 'oldpass',
        newPassword: 'newpass',
      });
      expect(toast.success).toHaveBeenCalledWith('Password updated successfully!');
    });
  });

  it('displays loading state when updating', async () => {
    let resolvePatch: ((value?: any) => void) | undefined;
    (api.patch as jest.Mock).mockImplementation(
      () => new Promise((resolve) => (resolvePatch = resolve))
    );

    setup();
    fireEvent.click(screen.getByTestId('update-username-btn'));
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    if (!resolvePatch) throw new Error('resolvePatch is not assigned');
    resolvePatch({});
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('calls logout when logout button is clicked', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('renders fallback if no user', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      updateUser: mockUpdateUser,
      logout: mockLogout,
    });

    setup();
    expect(screen.getByText(/unable to load user profile/i)).toBeInTheDocument();
  });
});
