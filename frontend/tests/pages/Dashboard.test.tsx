// tests/pages/Dashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../src/pages/Dashboard';
import api from '../../src/api/axios';

jest.mock('../../src/api/axios');

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard data after fetching', async () => {
    // Mock API responses
    (api.get as jest.Mock).mockImplementation((url) => {
      if (url === '/dashboard/stats') {
        return Promise.resolve({
          data: {
            dashboardstats: {
              totalJobs: 5,
              jobsByStatus: { Applied: 2, Interview: 1, offer: 1 },
              jobsByTag: { frontend: 2, backend: 1 },
            },
          },
        });
      }
      if (url === '/dashboard/activity') {
        return Promise.resolve({
          data: { nudges: ['Job without tag', 'Wishlist job'] },
        });
      }
      return Promise.reject(new Error('not found'));
    });

    render(<Dashboard />);

    // Wait for total jobs to appear
    const totalJobs = await screen.findByText('5');
    expect(totalJobs).toBeInTheDocument();

    // Check nudges rendered
    expect(await screen.findByText('Job without tag')).toBeInTheDocument();
    expect(await screen.findByText('Wishlist job')).toBeInTheDocument();
  });

  it('renders error message if fetching fails', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(<Dashboard />);

    const errorMsg = await screen.findByText(/unable to load dashboard data/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
