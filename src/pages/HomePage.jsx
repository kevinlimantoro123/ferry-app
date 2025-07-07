import React from "react";
import { MapPin, Map } from "lucide-react";
import RouteCard from "../components/RouteCard/Card";

const HomePage = ({
  selectedLocation,
  selectedTransport,
  setSelectedTransport,
  routeData,
  isRouteCardExpanded,
  setIsRouteCardExpanded,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Route to Ferry
        </h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{selectedLocation}</span>
        </div>
      </div>

      {/* Map View */}
      <div className="h-80 bg-gradient-to-br from-blue-100 to-green-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Map className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Map will display route here</p>
            <p className="text-sm text-gray-500 mt-2">
              Google Maps integration
            </p>
          </div>
        </div>
      </div>

      {/* Route Details Card */}
      {routeData && (
        <RouteCard
          routeData={routeData}
          selectedTransport={selectedTransport}
          setSelectedTransport={setSelectedTransport}
          isExpanded={isRouteCardExpanded}
          setIsExpanded={setIsRouteCardExpanded}
        />
      )}
    </div>
  );
};

export default HomePage;
