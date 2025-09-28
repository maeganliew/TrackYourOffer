import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Tag } from '../types';

interface TagFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tagData: { name: string; colour: string }) => void;
  tag?: Tag | null;
  isLoading?: boolean;
}

const PRESET_COLOURS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
];

const TagForm: React.FC<TagFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tag,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    colour: PRESET_COLOURS[0],
  });

  useEffect(() => {
    if (isOpen) {
      if (tag) {
        setFormData({
          name: tag.name,
          colour: tag.colour,
        });
      } else {
        setFormData({
          name: '',
          colour: PRESET_COLOURS[0],
        });
      }
    }
  }, [isOpen, tag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {tag ? 'Edit Tag' : 'Create New Tag'}
            </h3>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tag Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Frontend, Remote, Full-time"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tag Color
              </label>
              <div className="grid grid-cols-5 gap-3">
                {PRESET_COLOURS.map((colour) => (
                  <button
                    key={colour}
                    type="button"
                    onClick={() => setFormData({ ...formData, colour })}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      formData.colour === colour
                        ? 'border-gray-400 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: colour }}
                  />
                ))}
              </div>
              
              <div className="mt-3 flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.colour}
                  onChange={handleChange}
                  name="color"
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colour}
                  onChange={handleChange}
                  name="color"
                  className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                style={{
                  backgroundColor: `${formData.colour}20`,
                  color: formData.colour,
                  borderColor: `${formData.colour}40`,
                }}
              >
                {formData.name || 'Tag Name'}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {tag ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  tag ? 'Update Tag' : 'Create Tag'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TagForm;