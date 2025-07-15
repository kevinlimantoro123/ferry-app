import React from "react";
import { MapPin, AlertCircle } from "lucide-react";
import { useDrag } from "../../hooks/useDrag";
import CardHeader from "./CardHeader";
import TransportModeSelector from "./TransportModeSelector";
import RouteSummary from "./RouteSummary";
import FerryInfo from "./FerryInfo";
import ExpandedCard from "./ExpandedCard";

const RouteCard = ({
  routeData,
  selectedTransport,
  setSelectedTransport,
  isExpanded,
  setIsExpanded,
  onClose,
  onNavigateToFerry,
  loading = false,
  error = null,
}) => {
  const { dragRef, dragHandlers, dragStyles } = useDrag(
    isExpanded,
    setIsExpanded
  );

  if (error) {
    return (
      <div className="bg-white shadow-lg p-4">
        <div className="flex items-center space-x-2 text-red-500 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Route Error</span>
        </div>
        <p className="text-gray-600 text-sm">{error}</p>
        <button
          onClick={onClose}
          className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="bg-white shadow-lg p-4">
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a starting location
          </h3>
          <p className="text-gray-500">
            Search for a location to see route details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white shadow-lg transition-all duration-300 ease-in-out rounded-t-lg"
      style={dragStyles}
    >
      <CardHeader
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onClose={onClose}
        dragRef={dragRef}
        dragHandlers={dragHandlers}
      />

      {/* Main content */}
      <div className="p-4">
        <TransportModeSelector
          selectedTransport={selectedTransport}
          setSelectedTransport={setSelectedTransport}
        />

        <RouteSummary routeData={routeData} />

        <FerryInfo routeData={routeData} />

        {/* Expanded ferry information */}
        {isExpanded && <ExpandedCard routeData={routeData} />}
      </div>
    </div>
  );
};

export default RouteCard;
