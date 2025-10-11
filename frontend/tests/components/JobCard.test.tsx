import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobCard from '../../src/components/JobCard';
import { Job } from '../../src/types';
import { BrowserRouter } from 'react-router-dom';
import { format } from 'date-fns';

// Mock window.open
const originalOpen = window.open;
beforeAll(() => {
  window.open = jest.fn();
});
afterAll(() => {
  window.open = originalOpen;
});

const mockJob: Job = {
  id: '1',
  name: 'Test Job',
  status: 'Wishlist',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  appliedAt: new Date().toISOString(),
  file: { url: 'https://example.com/file.pdf', type: 'pdf', filename: 'file.pdf' },
  tags: [{ _id: 't1', name: 'Frontend', colour: '#ff0000', createdAt: new Date().toISOString() }],
};

const setup = (overrides = {}) => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onStatusChange = jest.fn();
  const onDateChange = jest.fn();

  render(
    <BrowserRouter>
      <JobCard
        job={{ ...mockJob, ...overrides }}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onDateChange={onDateChange}
      />
    </BrowserRouter>
  );

  return { onEdit, onDelete, onStatusChange, onDateChange };
};

describe('JobCard', () => {
  it('renders job name, status, tags, and created date', () => {
    setup();
    
    expect(screen.getByText(mockJob.name)).toBeInTheDocument();

    // Status badge only (span)
    const statusBadge = screen.getByText(mockJob.status, { selector: 'span' });
    expect(statusBadge).toBeInTheDocument();

    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText(`Added ${format(new Date(mockJob.createdAt), 'MMM d')}`)).toBeInTheDocument();
  });

  it('renders applied date and toggles date input on click', () => {
    const { onDateChange } = setup();
    const dateSpan = screen.getByText(/No date set|[A-Za-z]{3} \d{1,2}, \d{4}/);
    fireEvent.click(dateSpan);

    const input = screen.getByTestId(`applied-date-input-${mockJob.id}`) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe(mockJob.appliedAt.split('T')[0]);

    fireEvent.change(input, { target: { value: '2025-10-15' } });
    fireEvent.blur(input); // triggers handleDateSubmit
    expect(onDateChange).toHaveBeenCalledWith(mockJob.id, new Date('2025-10-15').toISOString());
  });

  it('calls onEdit when edit button is clicked', () => {
    const { onEdit } = setup();
    fireEvent.click(screen.getByTestId(`edit-button-${mockJob.id}`));
    expect(onEdit).toHaveBeenCalledWith(mockJob);
  });

  it('calls onDelete when delete button is clicked', () => {
    const { onDelete } = setup();
    fireEvent.click(screen.getByTestId(`delete-button-${mockJob.id}`));
    expect(onDelete).toHaveBeenCalledWith(mockJob.id);
  });

  it('opens file link when attachment button clicked', () => {
    setup();
    fireEvent.click(screen.getByText('View file'));
    expect(window.open).toHaveBeenCalledWith(mockJob.file!.url, '_blank');
  });

  it('calls onStatusChange when dropdown value changes', () => {
    const { onStatusChange } = setup();
    const select = screen.getByTestId(`status-select-${mockJob.id}`) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'Applied' } });
    expect(onStatusChange).toHaveBeenCalledWith(mockJob.id, 'Applied');
  });

  it('shows fallback when no tags or file', () => {
    setup({ tags: [], file: undefined });
    expect(screen.getByText('No tags added')).toBeInTheDocument();
    expect(screen.getByText('No file uploaded')).toBeInTheDocument();
  });
});
