// hooks/useLocationSearch.js
import { useState, useCallback, useEffect } from "react";
import googleMapsService from "../services/googleMaps";

export const useLocationSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const searchPlaces = useCallback(
    async (query) => {
      if (!query || query.length < 3) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await googleMapsService.searchPlaces(
          query,
          currentLocation
        );

        // Format results for your UI
        const formattedResults = (results || []).map((place) => ({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          type: "place",
        }));

        setSearchResults(formattedResults);
      } catch (err) {
        console.error("Error searching places:", err);
        // Don't show error to user for search failures, just show empty results
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [currentLocation]
  );

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const location = await googleMapsService.getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (err) {
      console.error("Error getting current location:", err);
      setError(
        "Unable to get current location. Please check your location permissions."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const geocodeAddress = useCallback(async (address) => {
    setLoading(true);
    setError(null);

    try {
      const result = await googleMapsService.geocodeAddress(address);
      return {
        address: result.formatted_address,
        location: {
          lat: result.location.lat(),
          lng: result.location.lng(),
        },
      };
    } catch (err) {
      console.error("Error geocoding address:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  // Get current location on mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    searchResults,
    loading,
    error,
    currentLocation,
    searchPlaces,
    getCurrentLocation,
    geocodeAddress,
    clearResults,
  };
};

export default useLocationSearch;
