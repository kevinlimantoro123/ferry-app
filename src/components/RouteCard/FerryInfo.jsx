import React from "react";

const FerryInfo = ({ routeData }) => {
  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-900 mb-2">Next Ferry Departures</h4>
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
  );
};

export default FerryInfo;
