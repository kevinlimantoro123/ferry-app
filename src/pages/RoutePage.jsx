import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import MapView from "../components/MapView";
import RouteCard from "../components/RouteCard/Card";

const RoutePage = ({
  selectedLocation,
  selectedTransport,
  setSelectedTransport,
  routeData,
  isRouteCardExpanded,
  setIsRouteCardExpanded,
}) => {
  const [searchValue, setSearchValue] = useState(selectedLocation || "");

  // Dummy route data
  const defaultRouteData = {
    timeRange: "15:00 - 15:16 PM",
    duration: "16 minutes",
    distance: "12 km",
    ferry: {
      destination: "Kusu",
      times: ["15:30", "15:30", "16:00"],
    },
  };

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden">
      {/* Search bar at the top */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="p-4">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search destinations..."
          />
        </div>
      </div>

      {/* Full screen map */}
      <div className="absolute inset-0 pt-20">
        <MapView />
      </div>

      {/* Route Details Card */}
      <RouteCard
        routeData={routeData}
        selectedTransport={selectedTransport}
        setSelectedTransport={setSelectedTransport}
        isExpanded={isRouteCardExpanded}
        setIsExpanded={setIsRouteCardExpanded}
      />
    </div>
  );
};

export default RoutePage;
