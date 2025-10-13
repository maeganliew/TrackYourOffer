import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import JobDetail from '../../src/pages/JobDetail';
import api from '../../src/api/axios';
import toast from 'react-hot-toast';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../src/api/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

 jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

const mockJob = {
  id: '1',
  name: 'Frontend Developer',
  tags: [
    { _id: 't1', name: 'React', colour: '#61dafb' },
    { _id: 't2', name: 'TypeScript', colour: '#3178c6' },
  ],
  file: null,
  status: 'applied',
  appliedAt: '2025-10-01T12:00:00Z',
  updatedAt: '2025-10-05T12:00:00Z',
};

describe('JobDetail Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton initially', async () => {
    render(
      <MemoryRouter>
        <JobDetail />
      </MemoryRouter>
    );

    // The skeleton should be in the DOM immediately
    expect(screen.getByTestId('job-loading-skeleton')).toBeInTheDocument();
  });

  it('renders job details after API call', async () => {
  (api.get as jest.Mock).mockImplementation((url: string) => {
    if (url === '/jobs/1') return Promise.resolve({ data: { job: mockJob } });
    if (url === '/tags') return Promise.resolve({ data: { tags: [] } });
    return Promise.reject(new Error('Unknown endpoint'));
  });

    render(
      <MemoryRouter>
        <JobDetail />
      </MemoryRouter>
    );

    // Wait for job name to appear
    const jobName = await screen.findByText(mockJob.name);
    expect(jobName).toBeInTheDocument();

    // Check that all tags are rendered
    for (const tag of mockJob.tags) {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
    }
  });

  it('shows fallback if job not found', async () => {
  (api.get as jest.Mock).mockImplementation((url: string) => {
    if (url === '/jobs/1') return Promise.reject(new Error('404'));
    if (url === '/tags') return Promise.resolve({ data: { tags: [] } });
    return Promise.reject(new Error('Unknown endpoint'));
  });

    render(
      <MemoryRouter>
        <JobDetail />
      </MemoryRouter>
    );

    const fallbackElement = await waitFor(() =>
      screen.getByTestId('job-not-found')
    );    
    expect(fallbackElement).toBeInTheDocument();
    expect(fallbackElement).toHaveTextContent(/job not found/i);
    expect(toast.error).toHaveBeenCalledWith('Failed to load job details');
  });

  it('opens and closes edit job modal', async () => {
  (api.get as jest.Mock).mockImplementation((url: string) => {
    if (url === '/jobs/1') return Promise.resolve({ data: { job: mockJob } });
    if (url === '/tags') return Promise.resolve({ data: { tags: [] } });
    return Promise.reject(new Error('Unknown endpoint'));
  });

    render(
      <MemoryRouter>
        <JobDetail />
      </MemoryRouter>
    );

    // Wait for job details
    await waitFor(() => expect(screen.getByText(mockJob.name)).toBeInTheDocument());

    const editButton = screen.getByRole('button', { name: /edit job/i });
    fireEvent.click(editButton);

    // Use findByRole since opening may be async
    const modal = await screen.findByTestId('job-form-modal');
    expect(modal).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
