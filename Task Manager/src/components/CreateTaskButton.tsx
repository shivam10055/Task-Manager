import React from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onClick: () => void;
}

const CreateTaskButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 group bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-start overflow-hidden transition-all duration-300 hover:w-40 pl-4 shadow-lg"
    >
      {/* Show icon always */}
      <Plus className="w-5 h-5 min-w-5" />

      {/* Text only on hover */}
      <span className="ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Create New
      </span>
    </button>
  );
};

export default CreateTaskButton;
