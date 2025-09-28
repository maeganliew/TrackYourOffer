import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Tag } from '../types';

interface SortFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: 'name' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'name' | 'createdAt', order: 'asc' | 'desc') => void;
  selectedTag: string | null;
  onTagFilterChange: (tagId: string | null) => void;
  availableTags: Tag[];
  onAddJob: () => void;
  isLoading?: boolean;
}

const SortFilterBar: React.FC<SortFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  selectedTag,
  onTagFilterChange,
  availableTags,
  onAddJob,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Tag Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedTag || ''}
              onChange={(e) => onTagFilterChange(e.target.value || null)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="">All Tags</option>
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newOrder] = e.target.value.split('-') as ['name' | 'createdAt', 'asc' | 'desc'];
                onSortChange(newSortBy, newOrder);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
          </div>

          {/* Add Job Button */}
          <button
            onClick={onAddJob}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortFilterBar;