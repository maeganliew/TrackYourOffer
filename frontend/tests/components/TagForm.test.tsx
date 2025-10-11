import { render, screen, fireEvent } from '@testing-library/react';
import TagForm from '../../src/components/TagForm';
import { Tag } from '../../src/types'; // it's fine to not include index

describe('TagForm', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly when creating a new tag', () => {
    render(<TagForm isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByText(/create new tag/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tag name/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /create tag/i })).toBeInTheDocument();
  });

  test('prefills form when editing a tag', () => {
    const tag: Tag = { _id: 't1', name: 'Frontend', colour: '#3B82F6', createdAt: new Date().toISOString() };
    render(<TagForm isOpen={true} onClose={onClose} onSubmit={onSubmit} tag={tag} />);

    expect(screen.getByText(/edit tag/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tag name/i)).toHaveValue('Frontend');
    expect(screen.getByRole('button', { name: /update tag/i })).toBeInTheDocument();
  });

  test('updates name input and color input', () => {
    render(<TagForm isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    const nameInput = screen.getByLabelText(/tag name/i);
    fireEvent.change(nameInput, { target: { value: 'Backend' } });
    expect(nameInput).toHaveValue('Backend');

    const colorInput = screen.getByRole('textbox', { name: '' }); // the text input for colour has no label
    fireEvent.change(colorInput, { target: { value: '#FF0000' } });
    expect(colorInput).toHaveValue('#FF0000');
  });

  test('calls onSubmit with form data', () => {
    render(<TagForm isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
    
    const nameInput = screen.getByLabelText(/tag name/i);
    fireEvent.change(nameInput, { target: { value: 'Backend' } });

    const submitButton = screen.getByRole('button', { name: /create tag/i });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Backend',
      colour: expect.any(String),
    }));
  });

  test('calls onClose when clicking cancel', () => {
    render(<TagForm isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });
});
