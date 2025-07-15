// hooks/useDropdownHandler.js
import { useState, useEffect } from "react";
import { useLocationSearch } from "./useLocationSearch";
import { LOCATIONS } from "../data/ferryData";

export const useDropdownHandler = (onLocationSelect) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);

  const {
    searchResults,
    loading: searchLoading,
    currentLocation,
    searchPlaces,
    getCurrentLocation,
    clearResults,
  } = useLocationSearch();

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
    // Delay hiding dropdown to allow clicks on dropdown items
    setTimeout(() => {
      setShowSearchDropdown(false);
    }, 200);
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
    if (typeof location === "string") {
      // For predefined locations, pass directly
      onLocationSelect(location);
    } else {
      // For Google Places results, use the place name
      onLocationSelect(location.name);
    }
  };

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      onLocationSelect("Current Location");
      setShowSearchDropdown(false);
    }
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
  };
};
