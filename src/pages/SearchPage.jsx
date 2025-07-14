import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { MapPin, Search, X, Navigation, Loader } from "lucide-react";
import { LOCATIONS } from "../data/ferryData";
import { useLocationSearch } from "../hooks/useLocationSearch";

const SearchPage = ({ onLocationSelect, onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Use the same location search hook as RoutePage
  const {
    searchResults,
    loading: searchLoading,
    currentLocation,
    searchPlaces,
    getCurrentLocation,
    geocodeAddress,
    clearResults,
  } = useLocationSearch();

  // Filter predefined locations based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = LOCATIONS.filter((location) =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(LOCATIONS);
    }
  }, [searchQuery]);

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
    if (searchQuery.trim() !== "") {
      searchPlaces(searchQuery);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding dropdown to allow clicks on dropdown items
    setTimeout(() => {
      setShowSearchDropdown(false);
    }, 200);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      clearResults();
      setShowSearchDropdown(false);
    } else {
      searchPlaces(value);
      setShowSearchDropdown(true);
    }
  };

  const handleLocationSelect = async (location) => {
    if (typeof location === "string") {
      // Add ", Singapore" to make geocoding more accurate
      const searchTerm = location.toLowerCase().includes("singapore")
        ? location
        : `${location}, Singapore`;

      // For predefined locations, pass directly
      onLocationSelect(location);
    } else {
      // For Google Places results, use the place name
      onLocationSelect(location.name);
    }
  };

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      onLocationSelect("Current Location");
      setShowSearchDropdown(false);
    }
  };
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
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30 mt-1">
                {/* Current location option - always show when dropdown is visible */}
                <div
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors duration-150 ease-in-out"
                  onClick={handleUseCurrentLocation}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Current Location
                        </p>
                        <p className="text-sm text-gray-500">
                          Use your current location
                        </p>
                      </div>
                    </div>
                    {searchLoading && (
                      <Loader className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>

                {/* Search results - only show if there are results or if searching */}
                {(searchResults.length > 0 ||
                  searchLoading ||
                  searchQuery.trim() !== "") && (
                  <>
                    {/* Google Places search results */}
                    {searchResults.map((location, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 ease-in-out"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {location.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {location.address}
                              </p>
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
                      searchQuery.trim() !== "" && (
                        <div className="p-3 text-center">
                          <p className="text-sm text-gray-500">
                            No locations found
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
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
