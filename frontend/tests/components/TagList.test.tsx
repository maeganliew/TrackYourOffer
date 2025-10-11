import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TagList from '../../src/components/TagList';
import { Tag } from '../../src/types';

describe('TagList', () => {
  const mockTags: Tag[] = [
    {
      _id: '1',
      name: 'Frontend',
      colour: '#3B82F6',
      createdAt: '2025-10-11T00:00:00.000Z',
    },
    {
      _id: '2',
      name: 'Backend',
      colour: '#10B981',
      createdAt: '2025-10-10T00:00:00.000Z',
    },
  ];

  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onFilterByTag = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty state when no tags', () => {
    render(<TagList tags={[]} onEdit={onEdit} onDelete={onDelete} onFilterByTag={onFilterByTag} />);
    expect(screen.getByText(/no tags yet/i)).toBeInTheDocument();
    expect(screen.getByText(/create your first tag/i)).toBeInTheDocument();
  });

  test('renders tags and displays correct info', () => {
    render(<TagList tags={mockTags} onEdit={onEdit} onDelete={onDelete} onFilterByTag={onFilterByTag} />);
    
    // Check tag names  
    const frontendElements = screen.getAllByText('Frontend');
    expect(frontendElements.length).toBeGreaterThan(0);

    const backendElements = screen.getAllByText('Backend');
    expect(backendElements.length).toBeGreaterThan(0);

    // Check created dates
    const createdOct11 = screen.getAllByText('Created Oct 11, 2025');
    expect(createdOct11.length).toBeGreaterThan(0);

    const createdOct10 = screen.getAllByText('Created Oct 10, 2025');
    expect(createdOct10.length).toBeGreaterThan(0);
  });

  test('calls onEdit when edit button clicked', () => {
    render(<TagList tags={mockTags} onEdit={onEdit} onDelete={onDelete} onFilterByTag={onFilterByTag} />);
    const editButtons = screen.getAllByTitle('Edit tag');
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockTags[0]);
  });

  test('calls onDelete when delete button clicked', () => {
    render(<TagList tags={mockTags} onEdit={onEdit} onDelete={onDelete} onFilterByTag={onFilterByTag} />);
    const deleteButtons = screen.getAllByTitle('Delete tag');
    fireEvent.click(deleteButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(mockTags[1]._id);
  });

  test('calls onFilterByTag when tag clicked or "View Jobs" clicked', () => {
    render(<TagList tags={mockTags} onEdit={onEdit} onDelete={onDelete} onFilterByTag={onFilterByTag} />);
    
    // Click on tag container
    const tagContainers = screen.getAllByText('Frontend');
    fireEvent.click(tagContainers[0].closest('div')!);
    expect(onFilterByTag).toHaveBeenCalledWith(mockTags[0]._id);

    // Click "View Jobs" button
    const viewJobsButtons = screen.getAllByText(/view jobs/i);
    fireEvent.click(viewJobsButtons[1]);
    expect(onFilterByTag).toHaveBeenCalledWith(mockTags[1]._id);
  });
});
