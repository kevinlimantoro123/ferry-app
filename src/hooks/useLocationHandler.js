import { useState, useEffect } from "react";
import { useLocationSearch } from "./useLocationSearch";
import { LOCATIONS } from "../data/ferryData";

export const useLocationHandler = (
  selectedLocation,
  onLocationSelect,
  options = {}
) => {
  const {
    enableGeocoding = true, // RoutePage needs geocoding, SearchPage doesn't
    enableFiltering = false, // SearchPage needs location filtering, RoutePage doesn't
    keepDropdownOpenOnEmpty = true, // RoutePage behavior vs SearchPage behavior
  } = options;

  const [searchValue, setSearchValue] = useState(selectedLocation || "");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState(
    enableFiltering ? LOCATIONS : []
  );

  const {
    searchResults,
    loading: searchLoading,
    currentLocation,
    searchPlaces,
    getCurrentLocation,
    geocodeAddress,
    clearResults,
  } = useLocationSearch();

  // Update search value when selectedLocation changes (for RoutePage)
  useEffect(() => {
    if (selectedLocation && enableGeocoding) {
      setSearchValue(selectedLocation);
      handleLocationSelect(selectedLocation);
    }
  }, [selectedLocation, enableGeocoding]);

  // Filter predefined locations based on search query (for SearchPage)
  useEffect(() => {
    if (enableFiltering) {
      if (searchValue) {
        const filtered = LOCATIONS.filter((location) =>
          location.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredLocations(filtered);
      } else {
        setFilteredLocations(LOCATIONS);
      }
    }
  }, [searchValue, enableFiltering]);

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
      // Different behavior based on options
      if (keepDropdownOpenOnEmpty) {
        // RoutePage behavior - keep dropdown open even when search is empty
      } else {
        // SearchPage behavior - close dropdown when search is empty
        setShowSearchDropdown(false);
      }
    } else {
      searchPlaces(value);
      setShowSearchDropdown(true);
    }
  };

  const handleLocationSelect = async (location) => {
    setSearchValue(typeof location === "string" ? location : location.name);
    setShowSearchDropdown(false);
    clearResults();

    if (enableGeocoding) {
      // RoutePage behavior - geocode the location
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
    } else {
      // SearchPage behavior - pass location directly without geocoding
      if (typeof location === "string") {
        onLocationSelect(location);
      } else {
        onLocationSelect(location.name);
      }
    }
  };

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setSearchValue("Current Location");
      if (enableGeocoding) {
        setSelectedLocationData(location);
      }
      onLocationSelect("Current Location");
      setShowSearchDropdown(false);
    }
  };

  return {
    // State
    searchValue,
    searchQuery: searchValue, // Alias for SearchPage compatibility
    showSearchDropdown,
    selectedLocationData,
    currentLocation,
    searchResults,
    searchLoading,
    filteredLocations, // Only populated when enableFiltering is true

    // Handlers
    handleSearchFocus,
    handleSearchBlur,
    handleSearchChange,
    handleLocationSelect,
    handleUseCurrentLocation,
  };
};
