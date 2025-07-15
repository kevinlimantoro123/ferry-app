import React from "react";
import SearchBar from "../components/SearchBar";
import SearchDropdown from "../components/SearchDropdown";
import { MapPin, X } from "lucide-react";
import { useLocationHandler } from "../hooks/useLocationHandler";

const SearchPage = ({ onLocationSelect, onBack }) => {
  const {
    searchQuery,
    showSearchDropdown,
    filteredLocations,
    searchResults,
    searchLoading,
    currentLocation,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
    handleLocationSelect,
    handleUseCurrentLocation,
  } = useLocationHandler(null, onLocationSelect, {
    enableGeocoding: false,
    enableFiltering: true,
    keepDropdownOpenOnEmpty: false,
  });
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
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder="Search for a location..."
            />

            {/* Search dropdown */}
            <SearchDropdown
              showSearchDropdown={showSearchDropdown}
              searchQuery={searchQuery}
              searchResults={searchResults}
              searchLoading={searchLoading}
              onLocationSelect={handleLocationSelect}
              onUseCurrentLocation={handleUseCurrentLocation}
            />
          </div>
        </div>
      </div>

      {/* Predefined Location Results */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Popular Locations
        </h2>
        <div className="space-y-2">
          {filteredLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
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
