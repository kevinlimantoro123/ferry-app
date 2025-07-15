import { useState, useCallback, useEffect } from "react";
import { LOCATIONS } from "../data/ferryData";
import googleMapsService from "../services/googleMaps";

export const useDropdownHandler = (onLocationSelect) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Initialize current location on hook creation
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const location = await googleMapsService.getCurrentLocation();
        setCurrentLocation(location);
        console.log("Current location initialized:", location);
      } catch (error) {
        console.warn("Failed to initialize current location:", error);
        // Set a default location if all else fails
        setCurrentLocation({
          lat: 1.3521,
          lng: 103.8198,
          isDefault: true,
          error: error.message,
        });
      }
    };

    initializeLocation();
  }, []);

  const searchPlaces = useCallback(async (query) => {
    if (!query || query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const results = await googleMapsService.searchPlaces(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Error searching places:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setSearchLoading(true);
    try {
      const location = await googleMapsService.getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (error) {
      console.warn("Error getting current location, using fallback:", error);
      // Fallback location
      const fallbackLocation = {
        lat: 1.3521,
        lng: 103.8198,
        isDefault: true,
        error: error.message,
      };
      setCurrentLocation(fallbackLocation);
      return fallbackLocation;
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  // Filter predefined locations based on search query
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

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
    if (searchQuery.trim() !== "") {
      searchPlaces(searchQuery);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchDropdown(false);
    }, 150);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);

    if (value.trim() === "") {
      clearResults();
      setShowSearchDropdown(false);
    } else {
      searchPlaces(value);
      setShowSearchDropdown(true);
    }
  };

  const handleLocationSelect = async (location) => {
    let selectedLocationName;

    if (typeof location === "string") {
      // For predefined locations, pass directly
      selectedLocationName = location;
    } else {
      // For Google Places results, use the place name
      selectedLocationName = location.name;
    }

    // Immediately close the dropdown for responsive feeling
    setShowSearchDropdown(false);
    setSearchQuery(selectedLocationName);

    // Call the parent's location select handler
    if (onLocationSelect) {
      onLocationSelect(selectedLocationName);
    }
  };

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      // Instead of passing a string, pass the actual coordinates
      // by calling onLocationSelect with a special object
      if (onLocationSelect) {
        const locationName = location.isDefault
          ? "Singapore (Default Location)"
          : "Current Location";

        // Pass coordinates directly to avoid geocoding issues
        onLocationSelect({
          type: "coordinates",
          name: locationName,
          lat: location.lat,
          lng: location.lng,
          isDefault: location.isDefault,
        });
      }
      setShowSearchDropdown(false);
    }
  };

  const closeDropdown = () => {
    setShowSearchDropdown(false);
  };

  return {
    // State
    searchQuery,
    showSearchDropdown,
    filteredLocations,
    searchResults,
    searchLoading,
    currentLocation,

    // Handlers
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
    handleLocationSelect,
    handleUseCurrentLocation,
    closeDropdown,
  };
};
