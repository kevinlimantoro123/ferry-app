// pages/RoutePage.js
import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/SearchBar";
import SearchDropdown from "../components/SearchDropdown";
import MapView from "../components/MapView";
import RouteCard from "../components/RouteCard/Card";
import { Loader } from "lucide-react";
import { useRoute } from "../hooks/useRoute";
import { useLocationHandler } from "../hooks/useLocationHandler";
import { formatRouteData } from "../utils/ferryUtils";

const RoutePage = ({
  selectedLocation,
  onLocationSelect,
  onBack,
  onNavigateToFerry,
}) => {
  const [selectedTransport, setSelectedTransport] = useState("driving");
  const [cardState, setCardState] = useState("minimal");
  const centerUserLocationRef = useRef(null);

  // Custom hooks
  const {
    searchValue,
    showSearchDropdown,
    selectedLocationData,
    currentLocation,
    searchResults,
    searchLoading,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
    handleLocationSelect,
    handleUseCurrentLocation,
  } = useLocationHandler(selectedLocation, onLocationSelect, {
    enableGeocoding: true,
    enableFiltering: false,
    keepDropdownOpenOnEmpty: true,
  });

  const {
    routeData,
    loading: routeLoading,
    error: routeError,
    calculateRoute,
  } = useRoute(selectedLocationData);

  // Calculate route when transport mode changes
  useEffect(() => {
    if (selectedLocationData && selectedTransport) {
      calculateRoute(selectedTransport.toUpperCase());
    }
  }, [selectedTransport, selectedLocationData, calculateRoute]);

  // Format route data for RouteCard
  const currentRouteData = formatRouteData(routeData, selectedTransport);

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden">
      {/* Full screen map */}
      <div className="absolute inset-0">
        <MapView
          origin={selectedLocationData}
          destination={{ lat: 1.2711, lng: 103.8633 }} // Marina South Pier coordinates
          travelMode={selectedTransport.toUpperCase()}
          showRoute={!!selectedLocationData}
          userLocation={currentLocation}
          onCenterUserLocation={(fn) => {
            centerUserLocationRef.current = fn;
          }}
          onRouteCalculated={(route) => {
            // Handle route calculation if needed
          }}
        />
      </div>

      {/* Search bar overlaid on top of map */}
      <div className="absolute top-10 left-0 right-0 z-20">
        <div className="p-4 relative">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder="Search destinations..."
          />

          {/* Search dropdown */}
          <SearchDropdown
            showSearchDropdown={showSearchDropdown}
            searchValue={searchValue}
            searchResults={searchResults}
            searchLoading={searchLoading}
            onLocationSelect={handleLocationSelect}
            onUseCurrentLocation={handleUseCurrentLocation}
          />
        </div>
      </div>

      {/* Route Details Card */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        {currentRouteData && (
          <RouteCard
            routeData={currentRouteData}
            selectedTransport={selectedTransport}
            setSelectedTransport={setSelectedTransport}
            cardState={cardState}
            setCardState={setCardState}
            onClose={onBack}
            onCenterUserLocation={centerUserLocationRef.current}
            onNavigateToFerry={onNavigateToFerry}
            loading={routeLoading}
            error={routeError}
          />
        )}
      </div>

      {/* Loading overlay */}
      {routeLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
            <Loader className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-gray-700">Calculating route...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePage;
