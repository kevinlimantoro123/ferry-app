import React from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";

const CardHeader = ({
  isExpanded,
  setIsExpanded,
  onClose,
  dragRef,
  dragHandlers,
}) => {
  return (
    <div className="flex items-center px-3 pt-1 pb-1 relative">
      {/* Draggable handle bar - centered */}
      <div
        ref={dragRef}
        className="absolute left-1/2 transform -translate-x-1/2 cursor-grab active:cursor-grabbing"
        {...dragHandlers}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center space-x-2 ml-auto">
        {/* Arrow expand/collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
