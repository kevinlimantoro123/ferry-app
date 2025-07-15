import { useState, useCallback } from "react";
import googleMapsService from "../services/googleMaps";

export const useRoute = (origin) => {
  const [routeData, setRouteData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateRoute = useCallback(
    async (travelMode = "DRIVING") => {
      if (!origin) {
        setError("Origin location is required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Use coordinates for more reliable routing
        const destination = { lat: 1.2644, lng: 103.8203 }; // Marina South Pier coordinates

        let result;
        try {
          result = await googleMapsService.calculateRoute(
            origin,
            destination,
            travelMode
          );
        } catch (routeError) {
          // If the specific travel mode fails, try DRIVING as fallback
          if (travelMode !== "DRIVING") {
            console.warn(`${travelMode} routing failed, trying DRIVING mode`);
            result = await googleMapsService.calculateRoute(
              origin,
              destination,
              "DRIVING"
            );
            // Update the travelMode to reflect what actually worked
            travelMode = "DRIVING";
          } else {
            throw routeError;
          }
        }

        // Format the route data
        const formattedRoute = {
          distance: result.distance,
          duration: result.duration,
          durationValue: result.durationValue,
          distanceValue: result.distanceValue,
          steps: result.steps,
        };

        setRouteData((prev) => ({
          ...prev,
          [travelMode.toLowerCase()]: formattedRoute,
        }));
      } catch (err) {
        console.error("Error calculating route:", err);

        // Provide user-friendly error messages
        let userMessage = "Unable to calculate route. ";
        if (err.message.includes("ZERO_RESULTS")) {
          userMessage +=
            "No route found between these locations. Try a different starting point or travel mode.";
        } else if (err.message.includes("OVER_QUERY_LIMIT")) {
          userMessage += "Too many requests. Please try again later.";
        } else if (err.message.includes("REQUEST_DENIED")) {
          userMessage += "Route calculation is not available at the moment.";
        } else {
          userMessage += "Please check your internet connection and try again.";
        }

        setError(userMessage);
      } finally {
        setLoading(false);
      }
    },
    [origin]
  );

  return {
    routeData,
    loading,
    error,
    calculateRoute,
  };
};
