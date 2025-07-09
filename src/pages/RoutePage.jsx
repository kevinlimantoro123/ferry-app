import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MapView from "../components/MapView";
import RouteCard from "../components/RouteCard/Card";
import { MapPin } from "lucide-react";
import { LOCATIONS } from "../data/ferryData";

const RoutePage = ({ selectedLocation, onLocationSelect, onBack }) => {
  const [searchValue, setSearchValue] = useState(selectedLocation || "");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState("car");
  const [isRouteCardExpanded, setIsRouteCardExpanded] = useState(false);
  const [routeData, setRouteData] = useState(null);

  // Update search value when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setSearchValue(selectedLocation);
    }
  }, [selectedLocation]);

  // Generate route data when location is selected
  useEffect(() => {
    if (selectedLocation && selectedLocation !== "Marina South Pier") {
      // Mock route data - in production, this would call your googleMaps.js service
      setRouteData({
        timeRange: "15:00 - 15:16 PM",
        duration: "16 minutes",
        distance: "12 km",
        ferry: {
          destination: "Kusu",
          times: ["15:30", "15:30", "16:00"],
        },
        ferries: [
          {
            destination: "Kusu",
            times: ["15:30", "15:30", "16:00"],
          },
          {
            destination: "Lazarus",
            times: ["16:00", "16:30", "17:00"],
          },
          {
            destination: "St. John",
            times: ["15:45", "16:15", "16:45"],
          },
        ],
      });
    }
  }, [selectedLocation, selectedTransport]);

  const handleSearchFocus = () => {
    if (searchValue.trim() !== "") {
      const filtered = LOCATIONS.filter((location) =>
        location.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowSearchDropdown(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding dropdown to allow clicks on dropdown items
    setTimeout(() => {
      setShowSearchDropdown(false);
    }, 200);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredLocations([]);
      setShowSearchDropdown(false);
    } else {
      const filtered = LOCATIONS.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      // Only show dropdown if search bar is focused
      if (document.activeElement?.type === "text") {
        setShowSearchDropdown(true);
      }
    }
  };

  const handleLocationSelect = (location) => {
    setSearchValue(location);
    setShowSearchDropdown(false);
    setFilteredLocations([]);
    onLocationSelect(location);
  };

  // Use the generated routeData or fallback to default
  const defaultRouteData = {
    timeRange: "15:00 - 15:16 PM",
    duration: "16 minutes",
    distance: "12 km",
    ferry: {
      destination: "Kusu",
      times: ["15:30", "15:30", "16:00"],
    },
  };

  const currentRouteData = routeData || defaultRouteData;

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden">
      {/* Search bar at the top */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="p-4 relative">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder="Search destinations..."
          />

          {/* Search dropdown */}
          {showSearchDropdown && filteredLocations.length > 0 && (
            <div className="absolute top-full left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30">
              {filteredLocations.map((location, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 ease-in-out"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{location}</p>
                      <p className="text-sm text-gray-500">Starting Location</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Location
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full screen map */}
      <div className="absolute inset-0 pt-20">
        <MapView />
      </div>

      {/* Route Details Card */}
      <div className="fixed bottom-16 left-0 right-0 z-30">
        {currentRouteData && (
          <RouteCard
            routeData={currentRouteData}
            selectedTransport={selectedTransport}
            setSelectedTransport={setSelectedTransport}
            isExpanded={isRouteCardExpanded}
            setIsExpanded={setIsRouteCardExpanded}
            onClose={onBack}
          />
        )}
      </div>
    </div>
  );
};

export default RoutePage;
