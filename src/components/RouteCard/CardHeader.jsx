import React from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";

const CardHeader = ({ cardState, setCardState, onClose }) => {
  return (
    <div className="flex items-center px-3 relative">
      {/* Draggable handle bar - centered (handled by react-modal-sheet) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2">
        <div className="w-12 h-1 bg-zinc-400 rounded-full"></div>
      </div>

      <div className="flex items-center space-x-1 ml-auto mt-2">
        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2 bg-white hover:bg-gray-300 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6 text-black font-bold" />
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
