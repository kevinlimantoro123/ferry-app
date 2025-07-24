// components/MapView.js
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import googleMapsService from "../services/googleMaps";
import {
  getTodaysVesselData,
  getAllAvailableVesselData,
  loadVesselMovementData,
  VESSEL_DATA_PATH,
  getVesselsByRoute,
  startAutoRefresh,
  stopAutoRefresh,
} from "../data/ferryData";

const MapView = ({
  origin = null,
  destination = null,
  travelMode = "DRIVING",
  showRoute = false,
  onRouteCalculated = null,
  className = "w-full h-full",
  userLocation = null,
  onCenterUserLocation = null,
  showVessels = false, // New prop to control vessel visibility
  selectedRoute = null, // Filter vessels by route
}) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userLocationMarker, setUserLocationMarker] = useState(null);
  const [lastOrigin, setLastOrigin] = useState(null);
  const [lastDestination, setLastDestination] = useState(null);
  const [isLoadingVessels, setIsLoadingVessels] = useState(false);

  // Memoize location comparison to prevent unnecessary re-renders
  const locationChanged = useMemo(() => {
    const originChanged =
      !lastOrigin ||
      !origin ||
      lastOrigin.lat !== origin.lat ||
      lastOrigin.lng !== origin.lng;

    const destinationChanged =
      !lastDestination ||
      !destination ||
      lastDestination.lat !== destination.lat ||
      lastDestination.lng !== destination.lng;

    return originChanged || destinationChanged;
  }, [origin, destination, lastOrigin, lastDestination]);

  const loadAndDisplayVessels = useCallback(async () => {
    try {
      setIsLoadingVessels(true);
      console.log("Loading vessel movement data...");

      // Load vessel data using dummy data (forceDummy = true)
      await loadVesselMovementData(VESSEL_DATA_PATH, true);

      // Try to get today's vessel positions first
      let currentVessels = getTodaysVesselData();

      // If no today's data, try all available data
      if (currentVessels.length === 0) {
        console.log("No today's data found, trying all available data...");
        currentVessels = getAllAvailableVesselData();
      }

      // If still no data, something is wrong
      if (currentVessels.length === 0) {
        console.error("No vessel data available at all!");
        setIsLoadingVessels(false);
        return;
      }

      // Filter by route if specified
      if (selectedRoute) {
        const filteredByRoute = getVesselsByRoute(selectedRoute);
        if (filteredByRoute.length > 0) {
          currentVessels = filteredByRoute;
        }
      }

      // Filter to only ferry vessels for better relevance if no route selected
      if (!selectedRoute) {
        const ferryVessels = currentVessels.filter(
          (vessel) =>
            vessel.vesselCategory === "Ferry" ||
            vessel.shipType.toLowerCase().includes("ferry") ||
            vessel.shipType.toLowerCase().includes("passenger")
        );

        // Use ferry vessels if found, otherwise use all vessels
        if (ferryVessels.length > 0) {
          currentVessels = ferryVessels;
          console.log(`Found ${ferryVessels.length} ferry vessels`);
        } else {
          console.log(
            `No ferry vessels found, showing all ${currentVessels.length} vessels`
          );
        }
      }

      console.log(`Displaying ${currentVessels.length} vessels on map`);
      console.log(
        "Vessels to display:",
        currentVessels.map((v) => ({
          name: v.name,
          type: v.vesselCategory,
          lat: v.latitude,
          lng: v.longitude,
        }))
      );

      // Display vessels on map using the new service method
      if (googleMapsService.map) {
        googleMapsService.displayVessels(currentVessels);
        console.log("Vessels displayed on map");
      } else {
        console.error("Google Maps not initialized!");
      }

      setIsLoadingVessels(false);
    } catch (error) {
      console.error("Error loading vessel data:", error);
      setIsLoadingVessels(false);
      // Don't show error to user as vessel data is optional
    }
  }, [selectedRoute]);

  // Auto-refresh vessel data every 15 seconds
  const startVesselAutoRefresh = useCallback(() => {
    console.log("Starting vessel auto-refresh (15 seconds)");
    startAutoRefresh((vessels) => {
      console.log(`Auto-refresh: Received ${vessels.length} vessels`);
      if (googleMapsService.map) {
        googleMapsService.displayVessels(vessels);
      }
    }, 15000); // 15 seconds
  }, []);

  const stopVesselAutoRefresh = useCallback(() => {
    console.log("Stopping vessel auto-refresh");
    stopAutoRefresh();
  }, []);

  const clearVesselMarkers = () => {
    // Use the new Google Maps service method
    googleMapsService.clearAllVesselMarkers();
  };

  const initializeMap = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await googleMapsService.createMap(mapRef.current, {
        zoom: 11,
        minZoom: 1,
        center: { lat: 1.3521, lng: 103.8198 },
        restriction: {
          latLngBounds: {
            north: 85,
            south: -85,
            west: -180,
            east: 180,
          },
          strictBounds: true,
        },
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#a2daf2" }],
          },
          {
            featureType: "landscape.man_made",
            elementType: "geometry",
            stylers: [{ color: "#f7f1df" }],
          },
        ],
      });
      setIsLoading(false);
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to load map. Please check your internet connection.");
      setIsLoading(false);
    }
  }, []);

  const clearCustomMarkers = useCallback(() => {
    setMarkers((currentMarkers) => {
      currentMarkers.forEach((marker) => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      return [];
    });
  }, []);

  const calculateAndDisplayRoute = useCallback(async () => {
    if (!origin || !destination) return;

    try {
      setIsLoading(true);

      // Clear existing route
      googleMapsService.clearRoute();

      // Only clear and recreate markers if the location actually changed
      if (locationChanged) {
        console.log("Location changed, clearing and recreating markers");
        clearCustomMarkers();
      }

      const result = await googleMapsService.calculateRoute(
        origin,
        destination,
        travelMode
      );

      // Display the route
      googleMapsService.displayRoute(result.route);

      // Clear and recreate markers when location changes
      if (locationChanged) {
        console.log("Location changed, clearing and recreating markers");

        // Clear existing markers first
        clearCustomMarkers();

        // Add custom markers for origin
        const originMarker = googleMapsService.addMarker(origin, {
          title: "Starting Location",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          },
        });

        // Add destination marker specifically for Marina South Pier
        const destinationMarker = googleMapsService.addMarker(destination, {
          title: "Marina South Pier - Ferry Terminal",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
        });

        setMarkers([originMarker, destinationMarker]);

        // Update last known locations
        setLastOrigin(origin);
        setLastDestination(destination);
      }

      // Callback with route data
      if (onRouteCalculated) {
        onRouteCalculated(result);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error calculating route:", err);
      setError("Failed to calculate route. Please try again.");
      setIsLoading(false);
    }
  }, [
    origin,
    destination,
    travelMode,
    locationChanged,
    onRouteCalculated,
    clearCustomMarkers,
  ]);

  const addUserLocationMarker = useCallback(async () => {
    console.log(
      "addUserLocationMarker called with userLocation:",
      userLocation
    );

    if (!userLocation) {
      console.log("No userLocation provided");
      return;
    }

    if (!googleMapsService.map) {
      console.log("Google Maps not initialized yet, retrying in 1 second...");
      setTimeout(() => {
        addUserLocationMarker();
      }, 1000);
      return;
    }

    try {
      // Clear existing user location marker first using setter function
      setUserLocationMarker((prevMarker) => {
        if (prevMarker) {
          prevMarker.setMap(null);
          console.log("Cleared existing user location marker");
        }
        return null;
      });

      console.log("Creating user location marker at:", userLocation);
      const userMarker = googleMapsService.addMarker(userLocation, {
        title: userLocation.isDefault
          ? "Default Location (Singapore)"
          : "Your Location",
        icon: {
          path: 0, // google.maps.SymbolPath.CIRCLE = 0
          fillColor: "#FFFFFF",
          fillOpacity: 1,
          strokeColor: userLocation.isDefault ? "#FF6B6B" : "#4285F4",
          strokeWeight: 3,
          scale: 8,
        },
      });

      setUserLocationMarker(userMarker);
      console.log("User location marker created successfully");
    } catch (err) {
      console.error("Error adding user location marker:", err);
      setTimeout(() => {
        console.log("Retrying user location marker creation...");
        addUserLocationMarker();
      }, 2000);
    }
  }, [userLocation]);

  // Cleanup auto-refresh on component unmount
  useEffect(() => {
    return () => {
      stopVesselAutoRefresh();
    };
  }, [stopVesselAutoRefresh]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    if (showRoute && origin && destination) {
      calculateAndDisplayRoute();
    } else if (!showRoute) {
      googleMapsService.clearRoute();
    }
  }, [
    origin,
    destination,
    travelMode,
    showRoute,
    locationChanged,
    calculateAndDisplayRoute,
  ]);

  useEffect(() => {
    if (userLocation) {
      addUserLocationMarker();
    }
  }, [userLocation, addUserLocationMarker]);

  // Handle vessel display
  useEffect(() => {
    if (showVessels && !isLoading) {
      loadAndDisplayVessels();
      startVesselAutoRefresh();
    } else {
      clearVesselMarkers();
      stopVesselAutoRefresh();
    }
  }, [
    showVessels,
    isLoading,
    selectedRoute,
    loadAndDisplayVessels,
    startVesselAutoRefresh,
    stopVesselAutoRefresh,
  ]);

  // Also try to add user location marker after map is initialized
  useEffect(() => {
    if (!isLoading && userLocation) {
      addUserLocationMarker();
    }
  }, [isLoading, userLocation, addUserLocationMarker]);

  const centerOnUserLocation = useCallback(() => {
    console.log("centerOnUserLocation called, userLocation:", userLocation);
    if (userLocation) {
      console.log("Centering map on:", userLocation);
      googleMapsService.panTo(userLocation);
      googleMapsService.setZoom(14);
    } else {
      console.log("No user location available");
    }
  }, [userLocation]);

  // Expose the center function to parent component
  useEffect(() => {
    if (onCenterUserLocation) {
      onCenterUserLocation(centerOnUserLocation);
    }
  }, [onCenterUserLocation, userLocation, centerOnUserLocation]);

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={initializeMap}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading overlay for map */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Vessel loading indicator */}
      {isLoadingVessels && (
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-md z-20">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Loading vessels...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(MapView, (prevProps, nextProps) => {
  return (
    prevProps.origin?.lat === nextProps.origin?.lat &&
    prevProps.origin?.lng === nextProps.origin?.lng &&
    prevProps.destination?.lat === nextProps.destination?.lat &&
    prevProps.destination?.lng === nextProps.destination?.lng &&
    prevProps.travelMode === nextProps.travelMode &&
    prevProps.showRoute === nextProps.showRoute &&
    prevProps.userLocation?.lat === nextProps.userLocation?.lat &&
    prevProps.userLocation?.lng === nextProps.userLocation?.lng &&
    prevProps.className === nextProps.className &&
    prevProps.showVessels === nextProps.showVessels &&
    prevProps.vesselRefreshInterval === nextProps.vesselRefreshInterval &&
    prevProps.selectedRoute === nextProps.selectedRoute
  );
});
