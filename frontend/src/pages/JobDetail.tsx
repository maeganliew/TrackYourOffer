import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag as TagIcon, Plus, X } from 'lucide-react';
import { Job, Tag } from '../types';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { getStatusColour } from '../../../backend/src/Constants'
import JobForm from '../components/JobForm';
import { useLocation } from 'react-router-dom';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [jobTags, setJobTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTagsLoading, setIsTagsLoading] = useState(false);

  const location = useLocation();
  const passedJob = location.state?.job as Job | undefined;

  useEffect(() => {
    if (passedJob) {
      // Use the passed job for faster display
      setJob(passedJob);
      if (passedJob.tags) {
        setJobTags(passedJob.tags);
      }
      fetchAvailableTags(); // still fetch all tags for dropdown
      setIsLoading(false);
    } 
    // In JobCard, always rendering from the fresh jobs list (from state) via fetchJobs().But in JobDetail, rendering from a stale passedJob (from location.state), it's not overriding it fully after edit.
    // in job form, on submit form it calls onSuccess() in Jobs, then Job calls fetchJobs(). so jobCard's data is fresh
    // but JobDetail it relies only on passedJob from location.state, it becomes stale after edits.
    if (id) {
      // if there's id, call fetchJob, refresh data. this guarantees a fresh fetch every time the id changes (or on mount).
      fetchJob();
      fetchAvailableTags();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      const jobData = response.data.job;
      //setJob(jobData);
      setTimeout(() => setJob(jobData), 0);
      setJobTags(jobData.tags || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    }
  };

  const fetchAvailableTags = async () => {
    setIsTagsLoading(true);
    try {
      const response = await api.get('/tags');
      setAvailableTags(response.data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsTagsLoading(false);
    }
  };

  const handleAddTag = async (tagId: string) => {
    try {
      await api.post(`/jobs/${id}/tags`, { tagId });
      const addedTag = availableTags.find(tag => tag._id === tagId);
      if (addedTag && !jobTags.find(tag => tag._id === tagId)) {
        setJobTags([...jobTags, addedTag]);
        toast.success('Tag added successfully!');
      }
      setIsAddingTag(false);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await api.delete(`/jobs/${id}/tags/${tagId}`);
      setJobTags(jobTags.filter(tag => tag._id !== tagId));
      toast.success('Tag removed successfully!');
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Job not found</p>
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-transparent rounded-md hover:bg-indigo-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const availableTagsToAdd = availableTags.filter(
    tag => !jobTags.find(jobTag => jobTag._id === tag._id)
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          to="/jobs"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </div>

      {/* Job Details */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.name}</h1>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColour(job.status)}`}>
                  {job.status}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  Applied on {format(new Date(job.appliedAt), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Application Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{job.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Applied:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(job.appliedAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(job.updatedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Tags
                </h3>
                <button
                  onClick={() => setIsAddingTag(!isAddingTag)}
                  className="text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Current Tags */}
                <div className="flex flex-wrap gap-2">
                  {jobTags.length > 0 ? (
                    jobTags.map((tag) => (
                      <div
                        key={tag._id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium group"
                        style={{
                          backgroundColor: `${tag.colour}20`,
                          color: tag.colour,
                          border: `1px solid ${tag.colour}40`,
                        }}
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag.name}
                        <button
                          onClick={() => handleRemoveTag(tag._id)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 hover:text-red-600" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No tags added yet</p>
                  )}
                </div>

                {/* Add Tag Section */}
                {isAddingTag && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Available tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableTagsToAdd.length > 0 ? (
                        availableTagsToAdd.map((tag) => (
                          <button
                            key={tag._id}
                            onClick={() => handleAddTag(tag._id)}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag.name}
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 italic">All available tags are already added</p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsAddingTag(false)}
                      className="mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
            >
              Edit Job
            </button>
            </div>
          </div>

          <JobForm
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onSuccess={fetchJob} // re-fetch job after update
            job={job}
          />
        </div>
      </div>
    </div>
  );
};

export default JobDetail;