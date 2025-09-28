import React from 'react';
import { Tag as TagIcon, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Tag } from '../types';
import { format } from 'date-fns';

interface TagListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (tagId: string) => void;
  onFilterByTag: (tagId: string) => void;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  onEdit,
  onDelete,
  onFilterByTag,
}) => {
  if (tags.length === 0) {
    return (
      <div className="text-center py-12">
        <TagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tags yet</h3>
        <p className="text-gray-500">Create your first tag to start organizing your jobs.</p>
      </div>
    );
  }

        console.log(tags);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tags.map((tag) => (
        <div
          key={tag._id}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 group"
        >
          <div className="flex items-start justify-between mb-3">
            <div 
              className="flex items-center cursor-pointer flex-1"
              onClick={() => onFilterByTag(tag._id)}
            >
              <div
                className="w-4 h-4 rounded-full mr-3 border-2"
                style={{ 
                  backgroundColor: `${tag.colour}30`,
                  borderColor: tag.colour 
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                  {tag.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Created {format(new Date(tag.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(tag)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                title="Edit tag"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(tag._id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete tag"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border"
              style={{
                backgroundColor: `${tag.colour}15`,
                color: tag.colour,
                borderColor: `${tag.colour}30`,
              }}
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag.name}
            </span>
            <button
              onClick={() => onFilterByTag(tag._id)}
              className="text-xs text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              View Jobs
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagList;