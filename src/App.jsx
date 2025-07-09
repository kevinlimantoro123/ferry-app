import React, { useState, useEffect } from "react";
import StartingPage from "./pages/StartingPage";
import SearchPage from "./pages/SearchPage";
import RoutePage from "./pages/RoutePage";
import FerryTimingsPage from "./pages/FerryTimings";
import BottomNavigation from "./components/Navbar";
import { FERRY_SCHEDULES, LOCATIONS } from "./data/ferryData";

const FerryApp = () => {
  const [currentPage, setCurrentPage] = useState("starting");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [ferryTimings, setFerryTimings] = useState([]);
  const [selectedFerryTab, setSelectedFerryTab] = useState("MSP");

  // Load ferry timings
  useEffect(() => {
    setFerryTimings(FERRY_SCHEDULES[selectedFerryTab] || []);
  }, [selectedFerryTab]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setCurrentPage("route");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "starting":
        return <StartingPage onSearchClick={() => setCurrentPage("search")} />;
      case "search":
        return (
          <SearchPage
            onLocationSelect={handleLocationSelect}
            onBack={() => setCurrentPage("starting")}
          />
        );
      case "route":
        return (
          <RoutePage
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            onBack={() => setCurrentPage("search")}
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

      {(currentPage === "starting" || currentPage === "ferry") && (
        <BottomNavigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default FerryApp;
