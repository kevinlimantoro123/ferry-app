// components/SearchDropdown.jsx
import React from "react";
import { MapPin, Navigation, Loader } from "lucide-react";

const SearchDropdown = ({
  showSearchDropdown,
  searchValue,
  searchResults,
  searchLoading,
  onLocationSelect,
  onUseCurrentLocation,
}) => {
  if (!showSearchDropdown) return null;

  return (
    <div className="absolute left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30 -mt-1">
      <div
        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors duration-150 ease-in-out"
        onClick={onUseCurrentLocation}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900">Current Location</p>
              <p className="text-sm text-gray-500">Use your current location</p>
            </div>
          </div>
          {searchLoading && <Loader className="h-4 w-4 animate-spin" />}
        </div>
      </div>

      {/* Search results - only show if there are results or if searching */}
      {searchValue.trim() !== "" && (
        <>
          {searchResults.map((location, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 ease-in-out"
              onClick={() => onLocationSelect(location)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Place
                </span>
              </div>
            </div>
          ))}

          {searchLoading && (
            <div className="p-3 text-center">
              <Loader className="h-4 w-4 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          )}

          {searchResults.length === 0 &&
            !searchLoading &&
            searchValue.trim() !== "" && (
              <div className="p-3 text-center">
                <p className="text-sm text-gray-500">No locations found</p>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default SearchDropdown;
