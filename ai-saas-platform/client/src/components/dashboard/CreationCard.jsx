import React from 'react';
import { Calendar, FileText, Image, Download, Trash2 } from 'lucide-react';

const CreationCard = ({ creation }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'article': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'image': return <Image className="h-5 w-5 text-green-600" />;
      case 'blog': return <FileText className="h-5 w-5 text-purple-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {getIcon(creation.type)}
          </div>
          <div>
            <h4 className="font-semibold">{creation.title}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(creation.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <span className={`
          text-xs font-medium px-2 py-1 rounded-full
          ${creation.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          ${creation.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${creation.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
        `}>
          {creation.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {creation.description}
      </p>

      <div className="flex items-center justify-end pt-4 border-t">
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-blue-600">
            <Download className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreationCard;
