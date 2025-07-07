import React from "react";
import { Car, ChevronUp, ChevronDown } from "lucide-react";

const Card = ({
  routeData,
  selectedTransport,
  setSelectedTransport,
  isExpanded,
  setIsExpanded,
}) => {
  return (
    <div className="bg-white m-4 rounded-lg shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Estimated Arrival</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </button>
        </div>

        <p className="text-gray-600 mb-4">{routeData.arrival}</p>

        {/* Transport Mode Tabs */}
        <div className="flex space-x-1 mb-4">
          {["Car", "Public", "Walk"].map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedTransport(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedTransport === mode
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Route Info */}
        <div className="flex items-center space-x-4 mb-4">
          <Car className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">{routeData.duration}</span>
          <span className="text-gray-600">({routeData.distance})</span>
        </div>

        {/* Next Ferry */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Next ferry - Kusu</h4>
          <div className="flex space-x-4 text-sm">
            <span className="font-medium">{routeData.nextFerry.time}</span>
            <span className="text-gray-600">
              {routeData.nextFerry.additional[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-4">
            {/* Detailed Route Info */}
            <div>
              <h5 className="font-semibold mb-2">Route Details</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Total Distance: {routeData.expandedInfo.totalDistance}</p>
                <p>Traffic: {routeData.expandedInfo.trafficCondition}</p>
                <p>Route: {routeData.expandedInfo.route}</p>
              </div>
            </div>

            {/* All Ferry Times */}
            <div>
              <h5 className="font-semibold mb-2">All Ferry Times</h5>
              <div className="grid grid-cols-4 gap-2">
                {routeData.nextFerry.additional.map((time, index) => (
                  <div
                    key={index}
                    className="text-center p-2 bg-white rounded border"
                  >
                    <span className="text-sm font-medium">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative Routes */}
            <div>
              <h5 className="font-semibold mb-2">Alternative Routes</h5>
              <div className="space-y-2">
                {routeData.expandedInfo.alternatives.map((alt, index) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{alt.route}</span>
                      <span className="text-sm text-gray-600">
                        {alt.duration}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {alt.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
