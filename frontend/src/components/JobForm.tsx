import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Job, Tag } from '../types';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job?: Job | null;
}

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSuccess, job }) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Applied' as Job['status'],
    appliedAt: new Date().toISOString().split('T')[0],
  });
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTagsLoading, setIsTagsLoading] = useState(false);

  useEffect(() => {
    // populate form with existing job data when form is opened
    if (isOpen) {
      if (job) {
        setFormData({
          name: job.name,
          status: job.status,
          appliedAt: job.appliedAt ? job.appliedAt.split('T')[0] : ''        
        });
        setSelectedTags(job.tags?.map(tag => tag._id) || []);
      } else {
        setFormData({
          name: '',
          status: 'Applied',
          appliedAt: new Date().toISOString().split('T')[0],
        });
        setSelectedTags([]);
      }
      fetchTags();
    }
  }, [isOpen, job]);

  const fetchTags = async () => {
    setIsTagsLoading(true);
    try {
      // Actual API call
      const response = await api.get('/tags');
      setAvailableTags(response.data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsTagsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default page refresh
    if (!formData.appliedAt || formData.appliedAt.trim() === '') {
      toast.error('Application date is required!');
      return;
    }
    setIsLoading(true);
    try {
      const jobData = {
        ...formData,
        appliedAt: new Date(formData.appliedAt).toISOString(),
      };

      if (job) {
        // Update existing job
        await api.patch(`/jobs/${job.id}/name`, { newJobName: formData.name });
        await api.patch(`/jobs/${job.id}/status`, { newJobStatus: formData.status });
        await api.patch(`/jobs/${job.id}/appliedAt`, { newTime: jobData.appliedAt });
        
        const oldTagIds = job.tags?.map(tag => tag._id.toString()) || [];
        const newTagIds = selectedTags;
        const tagsToAdd = newTagIds.filter(id => !oldTagIds.includes(id));
        const tagsToRemove = oldTagIds.filter(id => !newTagIds.includes(id));
        for (const tagId of tagsToAdd) {
          await api.post(`/jobs/${job.id}/tags`, { tagId });
        }
        for (const tagId of tagsToRemove) {
          await api.delete(`/jobs/${job.id}/tags/${tagId}`);
        }
        toast.success('Job updated successfully!');
      } else {
        // Create new job
        const response = await api.post('/jobs', jobData);
        const newJobId = response.data.id;
        
        // Add selected tags to the job
        for (const tagId of selectedTags) {
          await api.post(`/jobs/${newJobId}/tags`, { tagId });
        }
        
        toast.success('Job added successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {job ? 'Edit Job' : 'Add New Job'}
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
                Job Title
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Senior Frontend Developer at TechCorp"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Wishlit">Wishlist</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label htmlFor="appliedAt" className="block text-sm font-medium text-gray-700">
                Applied Date
              </label>
              <input
                type="date"
                id="appliedAt"
                name="appliedAt"
                value={formData.appliedAt}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {isTagsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableTags.length > 0 && availableTags.map((tag) => (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => toggleTag(tag._id)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedTags.includes(tag._id)
                          ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {selectedTags.includes(tag._id) && <Plus className="h-3 w-3 mr-1 rotate-45" />}
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
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
                    {job ? 'Updating...' : 'Adding...'}
                  </div>
                ) : (
                  job ? 'Update Job' : 'Add Job'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobForm;