import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileForm from '../../src/components/ProfileForm';
import { User } from '../../src/types';
import { Eye, EyeOff } from 'lucide-react';

describe('ProfileForm', () => {
  const mockUser: User = {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
  };

  const mockUpdateUsername = jest.fn(() => Promise.resolve());
  const mockUpdatePassword = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and username inputs', () => {
    render(
      <ProfileForm
        user={mockUser}
        onUpdateUsername={mockUpdateUsername}
        onUpdatePassword={mockUpdatePassword}
      />
    );

    expect(screen.getByDisplayValue(mockUser.email)).toBeDisabled();
    expect(screen.getByDisplayValue(mockUser.username)).toBeInTheDocument();
  });

  it('updates username input value', () => {
    render(
      <ProfileForm
        user={mockUser}
        onUpdateUsername={mockUpdateUsername}
        onUpdatePassword={mockUpdatePassword}
      />
    );

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'janedoe' } });
    expect(usernameInput.value).toBe('janedoe');
  });

  it('calls onUpdateUsername on submit', async () => {
    render(
      <ProfileForm
        user={mockUser}
        onUpdateUsername={mockUpdateUsername}
        onUpdatePassword={mockUpdatePassword}
      />
    );

    const usernameInput = screen.getByLabelText(/username/i) as HTMLInputElement;
    fireEvent.change(usernameInput, { target: { value: 'janedoe' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateUsername).toHaveBeenCalledWith('janedoe');
    });
  });

  it('shows alert if new passwords do not match', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
        <ProfileForm
        user={mockUser}
        onUpdateUsername={mockUpdateUsername}
        onUpdatePassword={mockUpdatePassword}
        />
    );

    fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'xyz' } });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('New passwords do not match');
        expect(mockUpdatePassword).not.toHaveBeenCalled();
    });
  });

  it('calls onUpdatePassword with correct values', async () => {
    render(
        <ProfileForm
        user={mockUser}
        onUpdateUsername={mockUpdateUsername}
        onUpdatePassword={mockUpdatePassword}
        />
    );

    fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'abcdef' } });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
        expect(mockUpdatePassword).toHaveBeenCalledWith('123456', 'abcdef');
    });
  });

  it('toggles password visibility', () => {
    render(
      <ProfileForm
        user={mockUser}
        onUpdateUsername={mockUpdateUsername}
        onUpdatePassword={mockUpdatePassword}
      />
    );

    const currentPasswordInput = screen.getByLabelText(/current password/i) as HTMLInputElement;
    const toggleButton = currentPasswordInput.parentElement!.querySelector('button') as HTMLButtonElement;

    // Initially type is password
    expect(currentPasswordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(currentPasswordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(currentPasswordInput.type).toBe('password');
  });
});
