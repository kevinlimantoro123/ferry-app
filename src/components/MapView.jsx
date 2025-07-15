// components/MapView.js
import { useEffect, useRef, useState } from "react";
import googleMapsService from "../services/googleMaps";

const MapView = ({
  origin = null,
  destination = null,
  travelMode = "DRIVING",
  showRoute = false,
  onRouteCalculated = null,
  className = "w-full h-full",
  userLocation = null,
  onCenterUserLocation = null,
}) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userLocationMarker, setUserLocationMarker] = useState(null);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (showRoute && origin && destination) {
      calculateAndDisplayRoute();
    } else if (!showRoute) {
      googleMapsService.clearRoute();
    }
  }, [origin, destination, travelMode, showRoute]);

  useEffect(() => {
    if (userLocation) {
      addUserLocationMarker();
    }
  }, [userLocation]);

  // Also try to add user location marker after map is initialized
  useEffect(() => {
    if (!isLoading && userLocation) {
      addUserLocationMarker();
    }
  }, [isLoading, userLocation]);

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await googleMapsService.createMap(mapRef.current, {
        zoom: 11,
        minZoom: 1, // Prevent zooming out beyond world view
        center: { lat: 1.3521, lng: 103.8198 }, // Singapore center
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
  };

  const calculateAndDisplayRoute = async () => {
    if (!origin || !destination) return;

    try {
      setIsLoading(true);

      // Clear existing route and markers
      googleMapsService.clearRoute();
      clearCustomMarkers();

      const result = await googleMapsService.calculateRoute(
        origin,
        destination,
        travelMode
      );

      // Display the route
      googleMapsService.displayRoute(result.route);

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

      setMarkers((prev) => [...prev, originMarker, destinationMarker]);

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
  };

  const clearCustomMarkers = () => {
    markers.forEach((marker) => {
      if (marker.setMap) {
        marker.setMap(null);
      }
    });
    setMarkers([]);
  };

  const addUserLocationMarker = async () => {
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
      // Clear existing user location marker first
      if (userLocationMarker) {
        userLocationMarker.setMap(null);
        console.log("Cleared existing user location marker");
      }

      console.log("Creating user location marker at:", userLocation);
      const userMarker = googleMapsService.addMarker(userLocation, {
        title: userLocation.isDefault
          ? "Default Location (Singapore)"
          : "Your Location",
        icon: {
          path: 0, // google.maps.SymbolPath.CIRCLE = 0
          fillColor: "#FFFFFF",
          fillOpacity: 1,
          strokeColor: userLocation.isDefault ? "#FF6B6B" : "#4285F4", // Red for default, blue for actual location
          strokeWeight: 3,
          scale: 8,
        },
      });

      setUserLocationMarker(userMarker);
      console.log("User location marker created successfully");
    } catch (err) {
      console.error("Error adding user location marker:", err);
      // Retry once after a short delay
      setTimeout(() => {
        console.log("Retrying user location marker creation...");
        addUserLocationMarker();
      }, 2000);
    }
  };

  const centerOnUserLocation = () => {
    console.log("centerOnUserLocation called, userLocation:", userLocation);
    if (userLocation) {
      console.log("Centering map on:", userLocation);
      googleMapsService.panTo(userLocation);
      googleMapsService.setZoom(14);
    } else {
      console.log("No user location available");
    }
  };

  // Expose the center function to parent component
  useEffect(() => {
    if (onCenterUserLocation) {
      onCenterUserLocation(centerOnUserLocation);
    }
  }, [onCenterUserLocation, userLocation]); // Include userLocation so function gets updated

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

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
