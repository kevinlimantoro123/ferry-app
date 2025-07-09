import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { MapPin, Search, X } from "lucide-react";
import { LOCATIONS } from "../data/ferryData";

const SearchPage = ({ onLocationSelect, onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);

  // Filter locations based on search query
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
              onChange={setSearchQuery}
              placeholder="Search for a location..."
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
