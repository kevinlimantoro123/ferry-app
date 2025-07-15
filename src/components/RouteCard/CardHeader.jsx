import React from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";

const CardHeader = ({
  cardState,
  setCardState,
  onClose,
  dragRef,
  dragHandlers,
}) => {
  return (
    <div className="flex items-center px-3 relative">
      {/* Draggable handle bar - centered */}
      <div
        ref={dragRef}
        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 cursor-grab active:cursor-grabbing"
        {...dragHandlers}
      >
        <div className="w-12 h-1 bg-zinc-400 rounded-full"></div>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center space-x-1 ml-auto mt-2">
        {/* Arrow expand/collapse button
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronDown className="h-6 w-6 text-gray-500" />
          ) : (
            <ChevronUp className="h-6 w-6 text-gray-500" />
          )}
        </button> */}

        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2 bg-white hover:bg-gray-300 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-600 font-semibold" />
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
