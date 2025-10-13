import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Tags from '../../src/pages/Tags';
import api from '../../src/api/axios';
import toast from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

// Mock modules
jest.mock('../../src/api/axios');
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    Toaster: () => <div />,
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Tags Page', () => {
  const mockTags = [
    { _id: '1', name: 'Frontend', color: '#3B82F6', createdAt: new Date().toISOString() },
    { _id: '2', name: 'React', color: '#10B981', createdAt: new Date().toISOString() },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <Tags />
      </BrowserRouter>
    );

  it('renders loading placeholders initially', () => {
    setup();

    // tip should not show while loading
    expect(screen.queryByText(/Tip:/i)).not.toBeInTheDocument();
  });

  it('fetches and displays tags', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { tags: mockTags } });
    setup();

    const frontendTags = await screen.findAllByText('Frontend');
    const reactTags = await screen.findAllByText('React');

    expect(frontendTags[0]).toBeInTheDocument();
    expect(reactTags[0]).toBeInTheDocument();

    // Optionally, assert total number of tags by looking for all tag name headings
    const allTagNames = await screen.findAllByRole('heading', { level: 3 }); 
    expect(allTagNames.length).toBe(mockTags.length);
  });

  it('opens create tag form when clicking "Create Tag"', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { tags: [] } });
    setup();

    fireEvent.click(screen.getByRole('button', { name: /create tag/i }));

    await waitFor(() => {
        // Match the actual heading in TagForm
        expect(screen.getByRole('heading', { name: /Create New Tag/i })).toBeInTheDocument();
    });
  });

  it('deletes a tag successfully', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { tags: mockTags } });
    (api.delete as jest.Mock).mockResolvedValue({});

    setup();

    // Mock confirm dialog to always return true
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);

    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Assert API call and toast
    await waitFor(() => {
        expect(api.delete).toHaveBeenCalledWith('/tags/1');
        expect(toast.success).toHaveBeenCalledWith('Tag deleted successfully!');
    });
  });

  it('navigates when filtering by tag', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { tags: mockTags } });
    setup();

    const frontendTagContainer = await screen.findByRole('heading', { name: 'Frontend' });

    // Click on the container (or its parent if that's what triggers navigation)
    fireEvent.click(frontendTagContainer.closest('div')!);

    // Assert navigation
    expect(mockNavigate).toHaveBeenCalledWith('/jobs?tagId=1');
  });
});
