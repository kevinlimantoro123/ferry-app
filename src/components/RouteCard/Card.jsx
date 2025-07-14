// components/RouteCard/Card.js
import React from "react";
import {
  Car,
  Train,
  Navigation,
  Clock,
  MapPin,
  Footprints,
  AlertCircle,
} from "lucide-react";

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
  const transportIcons = {
    driving: Car,
    transit: Train,
    walking: Footprints,
  };

  const transportLabels = {
    driving: "Drive",
    transit: "Transit",
    walking: "Walk",
  };

  const TransportIcon = transportIcons[selectedTransport] || Car;

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
    <div className="bg-white shadow-lg transition-all duration-300 ease-in-out rounded-t-lg">
      {/* Handle bar */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {/* Transport mode selector */}
        <div className="flex space-x-2 mb-4">
          {Object.keys(transportIcons).map((mode) => {
            const Icon = transportIcons[mode];
            return (
              <button
                key={mode}
                onClick={() => setSelectedTransport(mode)}
                className={`flex-1 p-3 rounded-lg border transition-colors ${
                  selectedTransport === mode
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs font-medium">
                  {transportLabels[mode]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Route summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              To Marina South Pier
            </h3>
            <span className="text-sm text-gray-500">{routeData.timeRange}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {routeData.duration}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {routeData.distance}
              </span>
            </div>
          </div>
        </div>

        {/* Ferry information */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">
            Next Ferry Departures
          </h4>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                To {routeData.ferry.destination}
              </span>
              <span className="text-xs text-blue-600">Next times</span>
            </div>
            <div className="flex space-x-2">
              {routeData.ferry.times.map((time, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded ferry information */}
        {isExpanded && routeData.ferries && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              All Ferry Departures
            </h4>
            <div className="space-y-2">
              {routeData.ferries.map((ferry, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      To {ferry.destination}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ferry.times.map((time, timeIndex) => (
                      <span
                        key={timeIndex}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
          <button
            onClick={onNavigateToFerry}
            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Start Navigation
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
