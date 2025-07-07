import React, { useState, useEffect } from "react";
import StartingPage from "./pages/StartingPage";
import SearchPage from "./pages/SearchPage";
import HomePage from "./pages/HomePage";
import FerryTimingsPage from "./pages/FerryTimings";
import BottomNavigation from "./components/Navbar";
import { FERRY_SCHEDULES, LOCATIONS } from "./data/ferryData";

const FerryApp = () => {
  const [currentPage, setCurrentPage] = useState("starting");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTransport, setSelectedTransport] = useState("Car");
  const [routeData, setRouteData] = useState(null);
  const [ferryTimings, setFerryTimings] = useState([]);
  const [selectedFerryTab, setSelectedFerryTab] = useState("MSP");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);
  const [isRouteCardExpanded, setIsRouteCardExpanded] = useState(false);

  // Filter locations based on search query
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

  // Simulate getting route data when location is selected
  useEffect(() => {
    if (selectedLocation && selectedLocation !== "Marina South Pier") {
      // Mock route data - in production, this would call your googleMaps.js service
      setRouteData({
        duration: "16 minutes",
        distance: "12 km",
        arrival: "15:00 - 15:16 PM",
        nextFerry: {
          time: "15:30",
          additional: ["15:30", "16:00", "16:30", "17:00"],
        },
        expandedInfo: {
          totalDistance: "12.5 km",
          trafficCondition: "Light traffic",
          route: "Via AYE, Sentosa Gateway",
          alternatives: [
            {
              route: "Via ECP, Marina Coastal Dr",
              duration: "18 min",
              distance: "14 km",
            },
            {
              route: "Via Orchard, Harbourfront",
              duration: "22 min",
              distance: "15 km",
            },
          ],
        },
      });
      setCurrentPage("home");
    }
  }, [selectedLocation, selectedTransport]);

  // Load ferry timings
  useEffect(() => {
    setFerryTimings(FERRY_SCHEDULES[selectedFerryTab] || []);
  }, [selectedFerryTab]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchQuery("");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "starting":
        return <StartingPage onSearchClick={() => setCurrentPage("search")} />;
      case "search":
        return (
          <SearchPage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredLocations={filteredLocations}
            onLocationSelect={handleLocationSelect}
            onBack={() => setCurrentPage("starting")}
          />
        );
      case "home":
        return (
          <HomePage
            selectedLocation={selectedLocation}
            selectedTransport={selectedTransport}
            setSelectedTransport={setSelectedTransport}
            routeData={routeData}
            isRouteCardExpanded={isRouteCardExpanded}
            setIsRouteCardExpanded={setIsRouteCardExpanded}
          />
        );
      case "ferry":
        return (
          <FerryTimingsPage
            selectedFerryTab={selectedFerryTab}
            setSelectedFerryTab={setSelectedFerryTab}
            ferryTimings={ferryTimings}
          />
        );
      default:
        return <StartingPage onSearchClick={() => setCurrentPage("search")} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {renderPage()}

      {(currentPage === "home" || currentPage === "ferry") && (
        <BottomNavigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default FerryApp;
