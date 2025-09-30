import React, { useState } from 'react';
import { Calendar, CreditCard as Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { Job } from '../types';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onStatusChange: (jobId: string, status: Job['status']) => void;
  onDateChange: (jobId: string, date: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  onStatusChange,
  onDateChange
}) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(
    job.appliedAt ? job.appliedAt.split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const getStatusColour = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interview': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offer': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'wishlist': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDateSubmit = () => {
    onDateChange(job.id, new Date(tempDate).toISOString());
    setIsEditingDate(false);
  };

  const handleDateKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDateSubmit();
    } else if (e.key === 'Escape') {
      setTempDate(job.appliedAt.split('T')[0]);
      setIsEditingDate(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
            {job.name}
          </h3>
          <div className="mt-2 flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColour(job.status)}`}>
              {job.status}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {isEditingDate ? (
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  onBlur={handleDateSubmit}
                  onKeyDown={handleDateKeyPress}
                  className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              ) : (
                <span 
                  onClick={() => setIsEditingDate(true)}
                  className="cursor-pointer hover:text-indigo-600 transition-colors"
                >
                {job.appliedAt ? format(new Date(job.appliedAt), 'MMM d, yyyy'): 'No date set'}                
                  </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(job)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Edit job"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete job"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center flex-wrap gap-2">
            <TagIcon className="h-4 w-4 text-gray-400" />
            {job.tags.map((tag) => (
              <span
                key={tag._id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: `${tag.colour}15`,
                  color: tag.colour,
                  borderColor: `${tag.colour}30`,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Status Dropdown */}
      <div className="flex items-center justify-between">
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job.id, e.target.value as Job['status'])}
          className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Wishlist">Wishlist</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
        <span className="text-xs text-gray-500">
          Added {format(new Date(job.createdAt), 'MMM d')}
        </span>
      </div>
    </div>
  );
};

export default JobCard;