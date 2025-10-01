import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import JobForm from '../components/JobForm';
import SortFilterBar from '../components/SortFilterBar';
import { Job, Tag } from '../types';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const Jobs: React.FC = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagFromQuery = params.get('tagId');
    setSelectedTag(tagFromQuery);
    fetchJobs(tagFromQuery ?? undefined);
    fetchTags();
  }, [location.search]);

  const fetchJobs = async (tag?: string) => {
    try {
      const response = await api.get('/jobs', {
        params: {
          search: searchTerm,
          sortBy,
          order: sortOrder,
          tagId: tag ?? selectedTag,
        },
      });
      setJobs(response.data.jobs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      const availableTags = Array.isArray(response.data.tags) ? response.data.tags : [];
      setAvailableTags(availableTags);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setIsLoading(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setIsJobFormOpen(true);
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
      toast.success('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleStatusChange = async (jobId: string, status: Job['status']) => {
    try {
      await api.patch(`/jobs/${jobId}/status`, { newJobStatus: status });
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status } : job
      ));
      toast.success('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDateChange = async (jobId: string, date: string) => {
    try {
      console.log(jobId, date);
      await api.patch(`/jobs/${jobId}/appliedAt`, { newTime: date });
      setJobs(jobs.map(job => 
        // cannot set newTime, cuz jobCard reads appliedAt
        job.id === jobId ? { ...job, appliedAt: date } : job
      ));
      toast.success('Date updated successfully!');
    } catch (error) {
      console.error('Error updating date:', error);
    }
  };

  const handleFormSuccess = () => {
    fetchJobs();
    setEditingJob(null);
  };

  const handleSortChange = (newSortBy: 'name' | 'createdAt', newOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newOrder);
    // In a real app, you'd refetch data with new sort parameters
  };
  // Filter and sort jobs
  const filteredAndSortedJobs = jobs
    .filter(job => {
      const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || job.tags?.some(tag => tag._id === selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        <p className="mt-2 text-gray-600">Track and manage your job applications</p>
      </div>

      <SortFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        selectedTag={selectedTag}
        onTagFilterChange={setSelectedTag}
        availableTags={availableTags}
        onAddJob={() => setIsJobFormOpen(true)}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredAndSortedJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchTerm || selectedTag ? 'No jobs match your current filters' : 'No jobs found'}
          </div>
          <button
            onClick={() => setIsJobFormOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Add Your First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onDateChange={handleDateChange}
            />
          ))}
        </div>
      )}

      <JobForm
        isOpen={isJobFormOpen}
        onClose={() => {
          setIsJobFormOpen(false);
          setEditingJob(null);
        }}
        onSuccess={handleFormSuccess}
        job={editingJob}
      />
    </div>
  );
};

export default Jobs;