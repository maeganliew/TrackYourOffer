import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SortFilterBar from '../../src/components/SortFilterBar';
import { Tag } from '../../src/types/index';
import { within } from '@testing-library/react';

const mockTags: Tag[] = [
  { _id: '1', name: 'Frontend', colour: '#ff0000', createdAt: new Date().toISOString() },
  { _id: '2', name: 'Backend', colour: '#00ff00', createdAt: new Date().toISOString() },
];

describe('SortFilterBar', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnSortChange = jest.fn();
  const mockOnTagFilterChange = jest.fn();
  const mockOnAddJob = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial props', () => {
    render(
      <SortFilterBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortBy="name"
        sortOrder="asc"
        onSortChange={mockOnSortChange}
        selectedTag={null}
        onTagFilterChange={mockOnTagFilterChange}
        availableTags={mockTags}
        onAddJob={mockOnAddJob}
      />
    );

    expect(screen.getByPlaceholderText(/search jobs/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /all tags/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add job/i })).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search input', () => {
    render(
      <SortFilterBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortBy="name"
        sortOrder="asc"
        onSortChange={mockOnSortChange}
        selectedTag={null}
        onTagFilterChange={mockOnTagFilterChange}
        availableTags={mockTags}
        onAddJob={mockOnAddJob}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/search jobs/i), { target: { value: 'React' } });
    expect(mockOnSearchChange).toHaveBeenCalledWith('React');
  });

  it('calls onTagFilterChange when selecting a tag', () => {
    render(
      <SortFilterBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortBy="name"
        sortOrder="asc"
        onSortChange={mockOnSortChange}
        selectedTag={null}
        onTagFilterChange={mockOnTagFilterChange}
        availableTags={mockTags}
        onAddJob={mockOnAddJob}
      />
    );

    const tagFilterWrapper = screen.getByText(/all tags/i).closest('div')!;
    const select = within(tagFilterWrapper).getByRole('combobox');

    fireEvent.change(select, { target: { value: '1' } });
    expect(mockOnTagFilterChange).toHaveBeenCalledWith('1');
  });

  it('calls onSortChange when changing sort option', () => {
    render(
      <SortFilterBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortBy="name"
        sortOrder="asc"
        onSortChange={mockOnSortChange}
        selectedTag={null}
        onTagFilterChange={mockOnTagFilterChange}
        availableTags={mockTags}
        onAddJob={mockOnAddJob}
      />
    );

    fireEvent.change(screen.getByDisplayValue(/name a-z/i), { target: { value: 'createdAt-desc' } });
    expect(mockOnSortChange).toHaveBeenCalledWith('createdAt', 'desc');
  });

  it('calls onAddJob when Add Job button is clicked', () => {
    render(
      <SortFilterBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortBy="name"
        sortOrder="asc"
        onSortChange={mockOnSortChange}
        selectedTag={null}
        onTagFilterChange={mockOnTagFilterChange}
        availableTags={mockTags}
        onAddJob={mockOnAddJob}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add job/i }));
    expect(mockOnAddJob).toHaveBeenCalled();
  });

  it('disables Add Job button when isLoading is true', () => {
    render(
      <SortFilterBar
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortBy="name"
        sortOrder="asc"
        onSortChange={mockOnSortChange}
        selectedTag={null}
        onTagFilterChange={mockOnTagFilterChange}
        availableTags={mockTags}
        onAddJob={mockOnAddJob}
        isLoading={true}
      />
    );

    expect(screen.getByRole('button', { name: /add job/i })).toBeDisabled();
  });
});
