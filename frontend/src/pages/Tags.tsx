import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import TagList from '../components/TagList';
import TagForm from '../components/TagForm';
import { Tag } from '../types';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTagFormOpen, setIsTagFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      // Mock data for demonstration
      // const mockTags: Tag[] = [
      //   { id: '1', name: 'Frontend', color: '#3B82F6', createdAt: new Date(Date.now() - 86400000).toISOString() },
      //   { id: '2', name: 'React', color: '#10B981', createdAt: new Date(Date.now() - 172800000).toISOString() },
      //   { id: '3', name: 'Remote', color: '#8B5CF6', createdAt: new Date(Date.now() - 259200000).toISOString() },
      //   { id: '4', name: 'Full-time', color: '#F59E0B', createdAt: new Date(Date.now() - 345600000).toISOString() },
      //   { id: '5', name: 'TypeScript', color: '#EF4444', createdAt: new Date(Date.now() - 432000000).toISOString() },
      //   { id: '6', name: 'Node.js', color: '#06B6D4', createdAt: new Date(Date.now() - 518400000).toISOString() },
      // ];
      const response = await api.get('/tags');
      console.log("GET /tags response.data:", response.data);
      const fetchedTags = Array.isArray(response.data.tags) ? response.data.tags : [];
      setTags(fetchedTags);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setIsLoading(false);
    }
  };

  const handleCreateTag = () => {
    setEditingTag(null);
    setIsTagFormOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setIsTagFormOpen(true);
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This will remove it from all associated jobs.')) {
      return;
    }

    try {
      await api.delete(`/tags/${tagId}`);
      setTags(tags.filter(tag => tag._id !== tagId));
      toast.success('Tag deleted successfully!');
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleFormSubmit = async (tagData: { name: string; colour: string }) => {
    setIsSubmitting(true);
    try {
      if (editingTag) {
        // Update existing tag
        await api.patch(`/tags/${editingTag._id}`, tagData);
        setTags(tags.map(tag => 
          tag._id === editingTag._id 
            ? { ...tag, ...tagData }
            : tag
        ));
        toast.success('Tag updated successfully!');
      } else {
        // Create new tag
        const response = await api.post('/tags', tagData);
        const newTag: Tag = response.data.tag;
        newTag.createdAt = newTag.createdAt ?? new Date().toISOString();

        setTags([newTag, ...tags]);
        toast.success('Tag created successfully!');
      }
      
      setIsTagFormOpen(false);
      setEditingTag(null);
    } catch (error) {
      console.error('Error saving tag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterByTag = (tagId: string) => {
    // Navigate to jobs page with tag filter
    navigate(`/jobs?tagId=${tagId}`);
  };

  const handleCloseForm = () => {
    setIsTagFormOpen(false);
    setEditingTag(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="mt-2 text-gray-600">
            Organize your jobs with custom tags and labels
          </p>
        </div>
        <button
          onClick={handleCreateTag}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Tag
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded-full mr-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-indigo-700">
                    <strong>Tip:</strong> Click on any tag to filter your jobs, or use the action buttons to edit or delete tags.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <TagList
            tags={tags}
            onEdit={handleEditTag}
            onDelete={handleDeleteTag}
            onFilterByTag={handleFilterByTag}
          />
        </>
      )}

      <TagForm
        isOpen={isTagFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        tag={editingTag}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Tags;