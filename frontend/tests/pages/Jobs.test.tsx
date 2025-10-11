import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Jobs from '../../src/pages/Jobs';
import api from '../../src/api/axios';
import { BrowserRouter } from 'react-router-dom';
import { Job, Tag } from '../../src/types';

jest.mock('../../src/api/axios');
const mockedApi = api as jest.Mocked<typeof api>;

const jobsMock: Job[] = [
  {
    id: '1',
    name: 'First Job',
    status: 'Wishlist',
    appliedAt: new Date().toISOString(),
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const tagsMock: Tag[] = [
  { _id: '1', name: 'Frontend', colour: 'blue', createdAt: new Date().toISOString() },
];

describe('Jobs Page', () => {
  beforeEach(() => {
    mockedApi.get.mockReset();
    mockedApi.patch.mockReset();
    mockedApi.delete.mockReset();

    window.confirm = jest.fn(() => true);
  });

  it('renders jobs fetched from API', async () => {
    mockedApi.get.mockImplementation((url) => {
      if (url === '/jobs') return Promise.resolve({ data: { jobs: jobsMock } });
      if (url === '/tags') return Promise.resolve({ data: { tags: tagsMock } });
      return Promise.resolve({ data: {} });
    });

    render(
      <BrowserRouter>
        <Jobs />
      </BrowserRouter>
    );

    expect(await screen.findByText('First Job')).toBeInTheDocument();
    expect(screen.getByText('Jobs')).toBeInTheDocument();
  });

  it('opens job form when clicking add', async () => {
    mockedApi.get.mockResolvedValue({ data: { jobs: [], tags: [] } });

    render(
      <BrowserRouter>
        <Jobs />
      </BrowserRouter>
    );

    const addButton = await screen.findByTestId('add-first-job-button');
    fireEvent.click(addButton);

    const modal = await screen.findByTestId('job-form-modal');
    expect(modal).toBeInTheDocument();
  });

  it('deletes a job', async () => {
    mockedApi.get.mockResolvedValue({ data: { jobs: jobsMock, tags: [] } });
    mockedApi.delete.mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <Jobs />
      </BrowserRouter>
    );

    const deleteButton = await screen.findByTestId('delete-button-1');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedApi.delete).toHaveBeenCalledWith('/jobs/1');
    });
  });

  it('updates job status', async () => {
    mockedApi.get.mockResolvedValue({ data: { jobs: jobsMock, tags: [] } });
    mockedApi.patch.mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <Jobs />
      </BrowserRouter>
    );

    const statusSelect = await screen.findByTestId('status-select-1');
    fireEvent.change(statusSelect, { target: { value: 'Applied' } });

    await waitFor(() => {
      expect(mockedApi.patch).toHaveBeenCalledWith('/jobs/1/status', { newJobStatus: 'Applied' });
    });
  });

   it('updates applied date', async () => {
    mockedApi.get.mockResolvedValue({ data: { jobs: jobsMock, tags: [] } });
    mockedApi.patch.mockResolvedValue({ data: {} });

    render(
        <BrowserRouter>
        <Jobs />
        </BrowserRouter>
    );

    const jobCardTitle = await screen.findByText('First Job');
    const cardContainer = jobCardTitle.closest('div')!;

    // Click the date span to toggle input
    const dateDisplay = within(cardContainer).getByText(/Oct 11, 2025/);
    fireEvent.click(dateDisplay);

    // Find the input
    const dateInput = within(cardContainer).getByTestId('applied-date-input-1');

    // Use a fixed date string (YYYY-MM-DD)
    const newDate = '2025-10-11';
    fireEvent.change(dateInput, { target: { value: newDate } });
    fireEvent.blur(dateInput);

    await waitFor(() => {
        expect(mockedApi.patch).toHaveBeenCalledWith('/jobs/1/appliedAt', { newTime: new Date(newDate).toISOString() });
    });
    });

});