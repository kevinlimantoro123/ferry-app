// pages/RoutePage.js
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import MapView from "../components/MapView";
import RouteCard from "../components/RouteCard/Card";
import { MapPin, Navigation, Loader } from "lucide-react";
import { useRoute } from "../hooks/useRoute";
import { useLocationSearch } from "../hooks/useLocationSearch";

const RoutePage = ({
  selectedLocation,
  onLocationSelect,
  onBack,
  onNavigateToFerry,
}) => {
  const [searchValue, setSearchValue] = useState(selectedLocation || "");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState("driving");
  const [isRouteCardExpanded, setIsRouteCardExpanded] = useState(false);
  const [selectedLocationData, setSelectedLocationData] = useState(null);

  // Custom hooks
  const {
    searchResults,
    loading: searchLoading,
    currentLocation,
    searchPlaces,
    getCurrentLocation,
    geocodeAddress,
    clearResults,
  } = useLocationSearch();

  const {
    routeData,
    loading: routeLoading,
    error: routeError,
    calculateRoute,
  } = useRoute(selectedLocationData);

  // Update search value when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setSearchValue(selectedLocation);
      handleLocationSelect(selectedLocation);
    }
  }, [selectedLocation]);

  // Calculate route when transport mode changes
  useEffect(() => {
    if (selectedLocationData && selectedTransport) {
      calculateRoute(selectedTransport.toUpperCase());
    }
  }, [selectedTransport, selectedLocationData, calculateRoute]);

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
    if (searchValue.trim() !== "") {
      searchPlaces(searchValue);
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
      clearResults();
      // Keep dropdown open even when search is empty
    } else {
      searchPlaces(value);
      setShowSearchDropdown(true);
    }
  };

  const handleLocationSelect = async (location) => {
    setSearchValue(typeof location === "string" ? location : location.name);
    setShowSearchDropdown(false);
    clearResults();

    if (typeof location === "string") {
      const searchTerm = location.toLowerCase().includes("singapore")
        ? location
        : `${location}, Singapore`;

      // Geocode the address
      const geocoded = await geocodeAddress(searchTerm);
      if (geocoded) {
        setSelectedLocationData(geocoded.location);
        onLocationSelect(location);
      }
    } else {
      // Use the place data
      setSelectedLocationData(location.location);
      onLocationSelect(location.name);
    }
  };

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setSearchValue("Current Location");
      setSelectedLocationData(location);
      onLocationSelect("Current Location");
      setShowSearchDropdown(false);
    }
  };

  // Generate ferry times based on route duration using actual ferry schedules
  const generateFerryTimes = (routeDuration) => {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + (routeDuration * 1000 || 0));
    const arrivalTimeString = `${arrivalTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${arrivalTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // Use actual ferry schedules from Marina South Pier
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    const kusuSchedule = isWeekend
      ? [
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "12:00",
          "12:30",
          "13:00",
          "13:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
        ]
      : [
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
        ];

    // Find next ferry times after arrival
    const availableFerriesAfterArrival = kusuSchedule.filter(
      (time) => time >= arrivalTimeString
    );

    // If no ferries today, use first 3 of next day
    const nextFerryTimes =
      availableFerriesAfterArrival.length >= 3
        ? availableFerriesAfterArrival.slice(0, 3)
        : [
            ...availableFerriesAfterArrival,
            ...kusuSchedule.slice(0, 3 - availableFerriesAfterArrival.length),
          ];

    return nextFerryTimes.length > 0
      ? nextFerryTimes
      : ["09:00", "10:00", "11:00"];
  };

  // Format route data for RouteCard
  const formatRouteData = () => {
    if (!routeData || !routeData[selectedTransport]) {
      return null;
    }

    const route = routeData[selectedTransport];
    const ferryTimes = generateFerryTimes(route.durationValue);

    return {
      timeRange: `${new Date().toTimeString().substring(0, 5)} - ${new Date(
        Date.now() + route.durationValue * 1000
      )
        .toTimeString()
        .substring(0, 5)}`,
      duration: route.duration,
      distance: route.distance,
      ferry: {
        destination: "Kusu Island",
        times: ferryTimes,
      },
      ferries: [
        {
          destination: "Kusu Island",
          times: ferryTimes,
        },
        {
          destination: "Lazarus Island",
          times: ferryTimes.map((time) => {
            const [hours, minutes] = time.split(":");
            const newTime = new Date();
            newTime.setHours(parseInt(hours), parseInt(minutes) + 15);
            return newTime.toTimeString().substring(0, 5);
          }),
        },
        {
          destination: "St. John's Island",
          times: ferryTimes.map((time) => {
            const [hours, minutes] = time.split(":");
            const newTime = new Date();
            newTime.setHours(parseInt(hours), parseInt(minutes) + 30);
            return newTime.toTimeString().substring(0, 5);
          }),
        },
      ],
    };
  };

  const currentRouteData = formatRouteData();

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden">
      {/* Full screen map */}
      <div className="absolute inset-0">
        <MapView
          origin={selectedLocationData}
          destination={{ lat: 1.2711, lng: 103.8633 }} // Marina South Pier coordinates
          travelMode={selectedTransport.toUpperCase()}
          showRoute={!!selectedLocationData}
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
          {showSearchDropdown && (
            <div className="absolute left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30 -mt-1">
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
                    searchValue.trim() !== "" && (
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

      {/* Route Details Card */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        {currentRouteData && (
          <RouteCard
            routeData={currentRouteData}
            selectedTransport={selectedTransport}
            setSelectedTransport={setSelectedTransport}
            isExpanded={isRouteCardExpanded}
            setIsExpanded={setIsRouteCardExpanded}
            onClose={onBack}
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
