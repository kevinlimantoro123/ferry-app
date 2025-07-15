import React from "react";
import { Clock, Navigation } from "lucide-react";

const RouteSummary = ({ routeData }) => {
  return (
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
          <span className="text-sm text-gray-500">{routeData.distance}</span>
        </div>
      </div>
    </div>
  );
};

export default RouteSummary;
