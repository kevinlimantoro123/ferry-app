import React from "react";
import { Navigation, List } from "lucide-react";

const BottomNavigation = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
      <div className="flex justify-around py-3">
        <button
          onClick={() => setCurrentPage("home")}
          className={`flex flex-col items-center space-y-1 ${
            currentPage === "home" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <Navigation className="h-6 w-6" />
          <span className="text-xs">Route</span>
        </button>
        <button
          onClick={() => setCurrentPage("ferry")}
          className={`flex flex-col items-center space-y-1 ${
            currentPage === "ferry" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <List className="h-6 w-6" />
          <span className="text-xs">Ferry Times</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
