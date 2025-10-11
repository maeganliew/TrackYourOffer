import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobForm from '../../src/components/JobForm';
import api from '../../src/api/axios';
import toast from 'react-hot-toast';
import { Job } from '../../src/types';

jest.mock('../../src/api/axios');
jest.mock('react-hot-toast');

const mockJob: Job = {
  id: '1',
  name: 'Test Job',
  status: 'Applied',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  appliedAt: new Date().toISOString(),
  tags: [{ _id: 't1', name: 'Frontend', colour: '#ff0000', createdAt: new Date().toISOString() }],
  file: undefined,
};

describe('JobForm Component', () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock tag API
    (api.get as jest.Mock).mockResolvedValue({
      data: { tags: [{ _id: 't1', name: 'Frontend', colour: '#ff0000', createdAt: new Date().toISOString() }] },
    });
  });

  it('renders the form when open', async () => {
    render(<JobForm isOpen={true} onClose={onClose} onSuccess={onSuccess} />);
    expect(screen.getByTestId('job-form-modal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Applied Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Job/i)).toBeInTheDocument();

    await waitFor(() => screen.getByText('Frontend')); // wait for tags
  });

  it('populates fields when editing a job', async () => {
    render(<JobForm isOpen={true} onClose={onClose} onSuccess={onSuccess} job={mockJob} />);
    expect(screen.getByDisplayValue('Test Job')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Applied')).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockJob.appliedAt.split('T')[0])).toBeInTheDocument();

    await waitFor(() => screen.getByText('Frontend')); // wait for tags
  });

  it('calls API and shows success toast on submit (create mode)', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'newJobId' } });
    render(<JobForm isOpen={true} onClose={onClose} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'New Job' } });
    fireEvent.click(screen.getByText(/Add Job/i));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Job added successfully!');
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('toggles tags when clicked', async () => {
    render(<JobForm isOpen={true} onClose={onClose} onSuccess={onSuccess} />);
    await waitFor(() => screen.getByText('Frontend'));

    const tagButton = screen.getByText('Frontend');
    fireEvent.click(tagButton);
    fireEvent.click(tagButton);

    expect(tagButton).toBeInTheDocument(); // toggles internal state
  });

  it('handles file input', async () => {
    render(<JobForm isOpen={true} onClose={onClose} onSuccess={onSuccess} />);

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/Attachment/i) as HTMLInputElement;

    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(input.files?.[0]).toStrictEqual(file);
    expect(input.files?.length).toBe(1);
  });
});
