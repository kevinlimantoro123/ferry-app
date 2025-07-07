import React from "react";
import { Search } from "lucide-react";

const StartingPage = ({ onSearchClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Good morning!
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Input your current location below
        </p>

        <div className="relative">
          <button
            onClick={onSearchClick}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg text-left text-gray-500 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            Search
          </button>
          <Search className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default StartingPage;
