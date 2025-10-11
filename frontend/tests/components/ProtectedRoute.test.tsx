import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { useAuth } from '../../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../src/context/AuthContext');

const mockUseAuth = useAuth as jest.Mock;

describe('ProtectedRoute', () => {
  it('renders children when user is logged in', () => {
    mockUseAuth.mockReturnValue({ user: { id: '1', username: 'test' }, loading: false });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not logged in', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders nothing while loading', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });
});
