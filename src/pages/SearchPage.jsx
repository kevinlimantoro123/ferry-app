import React from "react";
import { MapPin, Search, X } from "lucide-react";

const SearchPage = ({
  searchQuery,
  setSearchQuery,
  filteredLocations,
  onLocationSelect,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Location Results */}
      <div className="p-4">
        <div className="space-y-2">
          {filteredLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => onLocationSelect(location)}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg text-left"
            >
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-gray-900">{location}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
