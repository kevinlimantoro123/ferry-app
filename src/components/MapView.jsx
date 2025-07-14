// components/MapView.js
import React, { useEffect, useRef, useState } from "react";
import googleMapsService from "../services/googleMaps";

const MapView = ({
  origin = null,
  destination = null,
  travelMode = "DRIVING",
  showRoute = false,
  onRouteCalculated = null,
  className = "w-full h-full",
}) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);

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

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await googleMapsService.createMap(mapRef.current, {
        zoom: 11,
        center: { lat: 1.3521, lng: 103.8198 }, // Singapore center
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
      const originMarker = googleMapsService.addMarker(
        typeof origin === "string"
          ? (await googleMapsService.geocodeAddress(origin)).location
          : origin,
        {
          title: "Starting Location",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
          },
        }
      );

      // Add destination marker specifically for Marina South Pier
      const destinationMarker = googleMapsService.addMarker(
        typeof destination === "string"
          ? (await googleMapsService.geocodeAddress(destination)).location
          : destination,
        {
          title: "Marina South Pier - Ferry Terminal",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
        }
      );

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
